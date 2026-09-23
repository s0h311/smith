import { Link, Text, Body, Container, Head, Html, Preview, Tailwind, pixelBasedPreset } from 'react-email'
import { EMAIL_FOOTER } from '../consts'

type Props = {
  url: string
  ttlInMinutes: number
}

export function SignInEmail({ url, ttlInMinutes }: Props) {
  return (
    <Html lang='de'>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Body className='bg-white font-sans text-gray-900'>
          <Preview>{`Your sign-in link for <app-name>`}</Preview>
          <Container className='max-w-lg mx-auto p-8'>
            <Text>Tap the link to sign in:</Text>

            <Link href={url}>Sign in</Link>

            <Text>
              The link works once and expires in {ttlInMinutes} minutes. If you did not ask to sign in, ignore this
              mail.
            </Text>

            <Text>{EMAIL_FOOTER}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
