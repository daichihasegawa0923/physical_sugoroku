import { Provider } from '@/components/ui/provider';
import { CommandContextProvider } from '@/shared/components/command.provider';
import Header from '@/shared/components/header';
import { Box, Theme } from '@chakra-ui/react';
import type { Metadata } from 'next';
import font from '@/shared/font';
import { MusicManagerProvider } from '@/shared/components/music.manager.provider';

export const metadata: Metadata = {
  title: '将棋王 | オンライン ボードゲーム',
  description: '将棋王は誰でも簡単に将棋が遊べるゲームです'
};

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true}>
      <body className={font}>
        <Provider>
          <Theme h="100%" appearance="light">
            <CommandContextProvider>
              <Box minHeight="100svh" h="auto" backgroundColor="#f4ca81">
                <Header />
                <MusicManagerProvider />
                {children}
              </Box>
            </CommandContextProvider>
          </Theme>
        </Provider>
      </body>
    </html>
  );
}
