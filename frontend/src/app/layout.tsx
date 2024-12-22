import { Provider } from '@/chakra/components/ui/provider'
import { CommandContextProvider } from '@/shared/components/command.provider'
import Header from '@/shared/components/header'
import { Box, Theme } from '@chakra-ui/react'
import type { Metadata } from 'next'
import font from '@/shared/font'

export const metadata: Metadata = {
  title: '将棋王 | オンライン ボードゲーム',
  description: '将棋王は誰でも簡単に将棋が遊べるゲームです'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning={true}>
      <body style={{ height: '100%' }} className={font}>
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
  )
}
