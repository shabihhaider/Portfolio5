import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shabih Haider | Full Stack Developer",
    template: "%s | Shabih Haider",
  },
  description: "Portfolio of Shabih Haider, a Full Stack Developer specializing in React, Next.js, AI Integration, and Modern Web Technologies. View my projects and skills.",
  keywords: ["Full Stack Developer", "React", "Next.js", "Portfolio", "Web Development", "AI", "Shabih Haider"],
  authors: [{ name: "Shabih Haider" }],
  creator: "Shabih Haider",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-shabihhaider.vercel.app",
    title: "Shabih Haider | Full Stack Developer",
    description: "Building the impossible with modern web technologies and AI.",
    siteName: "Shabih Haider Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shabih Haider | Full Stack Developer",
    description: "Building the impossible with modern web technologies and AI.",
    creator: "@shabihhaider",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
