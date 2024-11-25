import qrcodegen from './codegen'
import {
  DEFAULT_BGCOLOR,
  DEFAULT_FGCOLOR,
  DEFAULT_IMG_SCALE,
  DEFAULT_INCLUDEMARGIN,
  DEFAULT_LEVEL,
  DEFAULT_SIZE,
  ERROR_LEVEL_MAP,
  MARGIN_SIZE,
} from './constants'
import { Excavation, ImageSettings, Modules, QrProps, QrPropsSVG } from './types'
import { SUPPORTS_PATH2D } from './utils'

export const QrCodeSvg = (props: QrPropsSVG) => {
  const { config, ...svgProps } = props

  const {
    value,
    size = DEFAULT_SIZE,
    level = DEFAULT_LEVEL,
    bgColor = DEFAULT_BGCOLOR,
    fgColor = DEFAULT_FGCOLOR,
    includeMargin = DEFAULT_INCLUDEMARGIN,
    imageSettings,
  } = config

  let cells = qrcodegen.QrCode.encodeText(value, ERROR_LEVEL_MAP[level]).getModules()

  const margin = includeMargin ? MARGIN_SIZE : 0
  const numCells = cells.length + margin * 2
  const calculatedImageSettings = getImageSettings(cells, size, includeMargin, imageSettings)

  let image: null | JSX.Element = null

  if (!!imageSettings && !!calculatedImageSettings) {
    if (calculatedImageSettings.excavation != null) {
      cells = excavateModules(cells, calculatedImageSettings.excavation)
    }

    image = (
      <image
        href={imageSettings.src}
        height={calculatedImageSettings.h}
        width={calculatedImageSettings.w}
        x={calculatedImageSettings.x + margin}
        y={calculatedImageSettings.y + margin}
        preserveAspectRatio='none'
      />
    )
  }

  // Drawing strategy: instead of a rect per module, we're going to create a
  // single path for the dark modules and layer that on top of a light rect,
  // for a total of 2 DOM nodes. We pay a bit more in string concat but that's
  // way faster than DOM ops.
  // For level 1, 441 nodes -> 2
  // For level 40, 31329 -> 2
  const fgPath = generatePath(cells, margin)

  return (
    <svg height={size} width={size} viewBox={`0 0 ${numCells} ${numCells}`} {...svgProps}>
      <path fill={bgColor} d={`M0,0 h${numCells}v${numCells}H0z`} shapeRendering='crispEdges' />
      <path fill={fgColor} d={fgPath} shapeRendering='crispEdges' />
      {image}
    </svg>
  )
}

// We could just do this in generatePath, except that we want to support
// non-Path2D canvas, so we need to keep it an explicit step.
const excavateModules = (modules: Modules, excavation: Excavation): Modules => {
  return modules.slice().map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h) {
      return row
    }
    return row.map((cell, x) => {
      if (x < excavation.x || x >= excavation.x + excavation.w) {
        return cell
      }
      return false
    })
  })
}

const generatePath = (modules: Modules, margin = 0): string => {
  const ops: Array<string> = []
  modules.forEach(function (row, y) {
    let start: number | null = null
    row.forEach(function (cell, x) {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`)
        start = null
        return
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`)
        } else {
          // Otherwise finish the current line.
          ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`)
        }
        return
      }

      if (cell && start === null) {
        start = x
      }
    })
  })
  return ops.join('')
}

const getImageSettings = (
  cells: Modules,
  size: number,
  includeMargin: boolean,
  imageSettings?: ImageSettings,
):
  | {
      x: number
      y: number
      h: number
      w: number
      excavation: Excavation | null
    }
  | undefined => {
  if (!imageSettings) {
    return
  }

  const margin = includeMargin ? MARGIN_SIZE : 0
  const numCells = cells.length + margin * 2
  const scale = numCells / size
  const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE)
  const w = (imageSettings.width || defaultSize) * scale
  const h = (imageSettings.height || defaultSize) * scale
  const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale
  const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale

  let excavation: Excavation | null = null

  if (imageSettings.excavate) {
    const floorX = Math.floor(x)
    const floorY = Math.floor(y)
    const ceilW = Math.ceil(w + x - floorX)
    const ceilH = Math.ceil(h + y - floorY)
    excavation = { x: floorX, y: floorY, w: ceilW, h: ceilH }
  }

  return {
    x,
    y,
    h,
    w,
    excavation,
  }
}

export const getQrAsCanvas = async (
  props: QrProps,
  type: string,
  getCanvas?: boolean,
): Promise<HTMLCanvasElement | string> => {
  const {
    value,
    size = DEFAULT_SIZE,
    level = DEFAULT_LEVEL,
    bgColor = DEFAULT_BGCOLOR,
    fgColor = DEFAULT_FGCOLOR,
    includeMargin = DEFAULT_INCLUDEMARGIN,
    imageSettings,
  } = props

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  let cells = qrcodegen.QrCode.encodeText(value, ERROR_LEVEL_MAP[level]).getModules()
  const margin = includeMargin ? MARGIN_SIZE : 0
  const numCells = cells.length + margin * 2
  const calculatedImageSettings = getImageSettings(cells, size, includeMargin, imageSettings)

  const image = new Image()
  image.crossOrigin = 'anonymous'
  if (calculatedImageSettings) {
    await waitUntilImageLoaded(
      image,
      // @ts-expect-error: imageSettings is not null
      imageSettings.src,
    )
    if (calculatedImageSettings.excavation != null) {
      cells = excavateModules(cells, calculatedImageSettings.excavation)
    }
  }

  const pixelRatio = window.devicePixelRatio || 1
  canvas.height = canvas.width = size * pixelRatio
  const scale = (size / numCells) * pixelRatio
  ctx.scale(scale, scale)

  // Draw solid background, only paint dark modules.
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, numCells, numCells)

  ctx.fillStyle = fgColor
  if (SUPPORTS_PATH2D) {
    // $FlowFixMe: Path2D c'tor doesn't support args yet.
    ctx.fill(new Path2D(generatePath(cells, margin)))
  } else {
    cells.forEach(function (row, rdx) {
      row.forEach(function (cell, cdx) {
        if (cell) {
          ctx.fillRect(cdx + margin, rdx + margin, 1, 1)
        }
      })
    })
  }

  const haveImageToRender =
    calculatedImageSettings != null &&
    image !== null &&
    image.complete &&
    image.naturalHeight !== 0 &&
    image.naturalWidth !== 0
  if (haveImageToRender) {
    ctx.drawImage(
      image,
      calculatedImageSettings.x + margin,
      calculatedImageSettings.y + margin,
      calculatedImageSettings.w,
      calculatedImageSettings.h,
    )
  }

  if (getCanvas) return canvas

  const url = canvas.toDataURL(type, 1.0)
  canvas.remove()
  image.remove()
  return url
}

const waitUntilImageLoaded = (img: HTMLImageElement, src: string) => {
  return new Promise(resolve => {
    function onFinish() {
      img.onload = null
      img.onerror = null
      resolve(true)
    }
    img.onload = onFinish
    img.onerror = onFinish
    img.src = src
    img.loading = 'eager'
  })
}

export const getQrAsSvgDataUri = async (props: QrProps) => {
  const {
    value,
    size = DEFAULT_SIZE,
    level = DEFAULT_LEVEL,
    bgColor = DEFAULT_BGCOLOR,
    fgColor = DEFAULT_FGCOLOR,
    includeMargin = DEFAULT_INCLUDEMARGIN,
    imageSettings,
  } = props

  let cells = qrcodegen.QrCode.encodeText(value, ERROR_LEVEL_MAP[level]).getModules()

  const margin = includeMargin ? MARGIN_SIZE : 0
  const numCells = cells.length + margin * 2
  const calculatedImageSettings = getImageSettings(cells, size, includeMargin, imageSettings)

  let image = ''
  if (imageSettings != null && calculatedImageSettings != null) {
    if (calculatedImageSettings.excavation != null)
      cells = excavateModules(cells, calculatedImageSettings.excavation)

    const base64Image = await getBase64Image(imageSettings.src)

    image = [
      `<image href="${base64Image}"`,
      `height="${calculatedImageSettings.h}"`,
      `width="${calculatedImageSettings.w}"`,
      `x="${calculatedImageSettings.x + margin}"`,
      `y="${calculatedImageSettings.y + margin}"`,
      'preserveAspectRatio="none"></image>',
    ].join(' ')
  }

  const fgPath = generatePath(cells, margin)

  const svgData = [
    `<svg xmlns="http://www.w3.org/2000/svg" height="${size}" width="${size}" viewBox="0 0 ${numCells} ${numCells}">`,
    `<path fill="${bgColor}" d="M0,0 h${numCells}v${numCells}H0z" shapeRendering="crispEdges"></path>`,
    `<path fill="${fgColor}" d="${fgPath}" shapeRendering="crispEdges"></path>`,
    image,
    '</svg>',
  ].join('')

  return `data:image/svg+xml,${encodeURIComponent(svgData)}`
}

const getBase64Image = (imgUrl: string) => {
  return new Promise(function (resolve, reject) {
    const img = new Image()
    img.src = imgUrl
    img.setAttribute('crossOrigin', 'anonymous')

    img.onload = function () {
      const canvas = document.createElement('canvas')

      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)

      const dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)
    }

    img.onerror = function () {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('The image could not be loaded.')
    }
  })
}
