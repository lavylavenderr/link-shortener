import "../styles/globals.css";

import { ReactQueryProvider } from "@/components/providers/query";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import font from "next/font/local";
const primary = font({
  src: "../fonts/roobert-variable.woff2",
});

export const metadata: Metadata = {
  title: "Foxlink",
  description: "woa cool url shortner :3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={primary.className}>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
