import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "バカすごろく | オンラインで遊べるバカゲー",
  description: "バカすごろくは、オンラインですぐに遊べるバカゲーです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
