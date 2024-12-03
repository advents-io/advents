import ky from 'ky'

const WEBHOOKS = {
  FEEDBACKS:
    'https://discord.com/api/webhooks/1305608429649395742/t8fcJLxvTxciExz65A_W7APpp_9qTR7jliBG6NhWi1SsGQ-5EcrGsDPDVa18yPji23EG',
  DOMAINS:
    'https://discord.com/api/webhooks/1309241595559809054/7LpkjjHru3Sk195XoXHcRsUg6BzWgo1NKVu6yo0DNM5r3j5oFCUEP_hJHmfmgI2-UEs9',
}

type SendMessageProps = {
  webhookUrl: string
  message: string
}

const sendMessage = async ({ webhookUrl, message }: SendMessageProps) => {
  if (!webhookUrl) {
    return
  }

  try {
    await ky.post(webhookUrl, {
      json: {
        content: message,
        flags: 1 << 2, // Disable embeds
      },
    })
  } catch {}
}

export const discord = {
  sendMessage,
  WEBHOOKS,
}
