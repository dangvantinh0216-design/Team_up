import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "TeamUp | Find Your Perfect Squad",
  description: "The ultimate platform for developers and students to find teammates, manage projects, and build amazing products together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
