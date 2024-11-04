import { Provider } from '@/chakra/components/ui/provider'
import Header from '@/shared/components/header'
import { Box } from '@chakra-ui/react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'バカすごろく | オンラインで遊べるバカゲー',
  description: 'バカすごろくは、オンラインですぐに遊べるバカゲーです'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body>
        <Provider>
          <Header />
          <Box h="100svh">{children}</Box>
        </Provider>
      </body>
    </html>
  )
}
