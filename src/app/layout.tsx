import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
