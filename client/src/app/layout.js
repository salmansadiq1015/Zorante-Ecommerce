"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./content/authContent";
import { Toaster } from "react-hot-toast";
import { metadata } from "./metaData";
import QueryProvider from "./content/QueryProvider";
import { SessionProvider } from "next-auth/react";
import SocketHandler from "./content/SocketHandler";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="author" content={metadata.author} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />
        <link rel="canonical" href={metadata.canonical} />

        {/* Open Graph Metadata */}
        <meta property="og:type" content={metadata.og.type} />
        <meta property="og:title" content={metadata.og.title} />
        <meta property="og:description" content={metadata.og.description} />
        <meta property="og:url" content={metadata.og.url} />
        <meta property="og:image" content={metadata.og.image} />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.image} />

        {/* Favicon */}
        <link rel="icon" href="/rb_616.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/rb_616.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <title>{metadata.title}</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <AuthProvider>
              <NextTopLoader color="#fc030b" height={3} showSpinner={false} />
              <main className=" bg-white w-full min-h-screen text-black">
                {children}

                <Toaster position="bottom-center" />
                <SocketHandler />
              </main>
            </AuthProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
