import { Provider } from '@/chakra/components/ui/provider'
import Header from '@/shared/components/header'
import WebSocketContextProvider from '@/shared/function/websocket.context'
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
    <WebSocketContextProvider>
      <html>
        <body style={{ height: '100%' }}>
          <Provider>
            <Header />
            <Box h="calc(100svh - 54px)">{children}</Box>
          </Provider>
        </body>
      </html>
    </WebSocketContextProvider>
  )
}
