import { Provider } from '@/chakra/components/ui/provider'
import { CommandContextProvider } from '@/shared/components/command.provider'
import Header from '@/shared/components/header'
import WebSocketContextProvider from '@/shared/function/websocket.context'
import { Box, Theme } from '@chakra-ui/react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ダイナミックすごろく | オンラインで遊べるバカゲー',
  description: 'ダイナミックすごろくは、オンラインですぐに遊べるバカゲーです'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <WebSocketContextProvider>
      <html suppressHydrationWarning={true}>
        <body style={{ height: '100%' }}>
          <Provider>
            <Theme appearance="light">
              <CommandContextProvider>
                <Header />
                <Box h="calc(100svh - 54px)">{children}</Box>
              </CommandContextProvider>
            </Theme>
          </Provider>
        </body>
      </html>
    </WebSocketContextProvider>
  )
}
