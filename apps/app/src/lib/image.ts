import Compressor from 'compressorjs'

type Options = Omit<Compressor.Options, 'success' | 'error'>

const compress = async (file: File, options: Options): Promise<File> => {
  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      ...options,
      success: compressedFile => {
        if (compressedFile instanceof File) {
          return resolve(compressedFile)
        }

        const compressedFileFromBlob = new File([compressedFile], file.name, {
          type: compressedFile.type,
        })

        return resolve(compressedFileFromBlob)
      },
      error: reject,
    })
  })
}

export const image = {
  compress,
}
