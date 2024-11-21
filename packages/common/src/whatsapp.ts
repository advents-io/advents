const buildMessageUrl = (phone: string, message?: string) => {
  let url = `https://wa.me/${phone}`

  if (message) {
    url += `?text=${message}`
  }

  return url
}

export const whatsapp = {
  buildMessageUrl,
}
