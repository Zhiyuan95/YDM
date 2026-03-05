import type { Metadata } from "next";
import { Geist, Playfair_Display, Newsreader } from "next/font/google";
import BackToTop from "@/components/common/BackToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Media Archive",
  description: "A modern digital media archive and gallery exploration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${playfair.variable} ${newsreader.variable} antialiased`}
      >
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
