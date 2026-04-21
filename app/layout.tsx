import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techonpartners.com"),
  title: {
    default: "Techon Partners | Strategic Technology Leadership",
    template: "%s | Techon Partners",
  },
  description:
    "Techon Partners delivers strategic technology leadership for growing companies: fractional CTO services including engineering strategy, team building, and architecture advisory.",
  keywords: [
    "fractional CTO",
    "fractional chief technology officer",
    "Techon Partners",
    "startup CTO",
    "engineering leadership",
    "technology strategy",
    "part-time CTO",
    "interim CTO",
    "tech advisory",
    "strategic technology leadership",
  ],
  authors: [{ name: "Techon Partners" }],
  creator: "Techon Partners",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techonpartners.com",
    siteName: "Techon Partners",
    title: "Techon Partners | Strategic Technology Leadership",
    description:
      "Techon Partners delivers strategic technology leadership for growing companies: fractional CTO services including engineering strategy, team building, and architecture advisory.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techon Partners | Strategic Technology Leadership",
    description:
      "Strategic technology leadership for growing companies. Fractional CTO services without the full-time cost.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
