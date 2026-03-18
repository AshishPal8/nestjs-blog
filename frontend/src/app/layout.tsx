import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ApolloClientProvider from "../providers/apollo-provider";
import { Suspense } from "react";
import { HandleAuth } from "../components/auth/HandleAuth";
import LoginModal from "../modal/login-modal";
import { AuthModalTrigger } from "../components/auth/AuthModalTrigger";
import { Toaster } from "sonner";
import { KeepAlive } from "../lib/keep-alive";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insights & Stories - Discover Amazing Content",
  description:
    "Read insightful articles and stories from talented writers. Explore topics on career development, communication, technology, and personal growth.",
  generator: "Blogapp",
  keywords: [
    "blog",
    "articles",
    "stories",
    "insights",
    "career",
    "technology",
    "communication",
  ],
  openGraph: {
    title: "Insights & Stories - Discover Amazing Content",
    description:
      "Read insightful articles and stories from talented writers. Explore topics on career development, communication, technology, and personal growth.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Insights & Stories",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Insights & Stories - Blog Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Stories - Discover Amazing Content",
    description: "Read insightful articles and stories from talented writers.",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-image.jpg`,
    ],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloClientProvider>
          <Suspense fallback={null}>
            <HandleAuth />
            <AuthModalTrigger />
          </Suspense>
          <KeepAlive />
          <LoginModal />
          {children}
          <Toaster richColors position="top-center" />
        </ApolloClientProvider>
      </body>
    </html>
  );
}
