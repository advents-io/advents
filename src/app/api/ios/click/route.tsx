import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const clickId = searchParams.get('clickId')
  const redirect = searchParams.get('redirect')

  if (!clickId || !redirect) {
    return new NextResponse('Missing required parameters', { status: 400 })
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Carregando...</title>
        <script>
          function copyToClipboard() {
            navigator.clipboard.writeText('${clickId}').then(() => {
              window.location.href = '${redirect}';
            }).catch((err) => {
              window.location.href = '${redirect}';
            });
          }
        </script>
      </head>
      <body onload="copyToClipboard()">
        <p>Carregando...</p>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
