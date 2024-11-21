const buildMessageUrl = (phone: string, message?: string) => {
  let url = `https://api.whatsapp.com/send?phone=${phone}`

  if (message) {
    const encodedMessage = encodeURIComponent(message)
    url += `&text=${encodedMessage}`
  }

  return url
}

export const whatsapp = {
  buildMessageUrl,
}
