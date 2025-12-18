import { createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const from = `"${process.env.MAIL_FROM_NAME!}" <${process.env.MAIL_FROM_ADDRESS!}>`

const transport = createTransport({
  host: process.env.MAIL_SMTP_HOST!,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_SMTP_USER!,
    pass: process.env.MAIL_SMTP_PASSWORD!,
  },
})

export function sendMail({
  recipients,
  subject,
  text,
}: {
  recipients: string[]
  subject: string
  text: string
}): Promise<SMTPTransport.SentMessageInfo> {
  return transport.sendMail({
    from,
    to: recipients.join(', '),
    subject,
    text,
  })
}

export function sendMailWithHtml({
  recipients,
  subject,
  html,
}: {
  recipients: string[]
  subject: string
  html: string
}): Promise<SMTPTransport.SentMessageInfo> {
  return transport.sendMail({
    from,
    to: recipients.join(', '),
    subject,
    html,
  })
}
