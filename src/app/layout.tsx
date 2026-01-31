import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProjectX OS — The Human Upgrade",
  description: "In the Age of Machines, We Build Humans. Experience the future of human potential.",
  keywords: ["ProjectX", "Human Upgrade", "Experience OS", "Future", "Technology"],
  authors: [{ name: "ProjectX Team" }],
  openGraph: {
    title: "ProjectX OS — The Human Upgrade",
    description: "In the Age of Machines, We Build Humans.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProjectX OS — The Human Upgrade",
    description: "In the Age of Machines, We Build Humans.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
