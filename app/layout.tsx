import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { dark } from '@clerk/themes'
import { PostHogProvider } from '../components/PostHogProvider'

export const metadata: Metadata = {
  title: 'JetShort - URL Shortener',
  description: 'A modern URL shortener for creating short, shareable links or generating QR codes.',
  openGraph: {
    title: 'JetShort - URL Shortener',
    description: 'A modern URL shortener for creating short, shareable links or generating QR codes.',
    images: [
      {
        url: 'https://madebyjet.dev/favicon.png',
      },
    ],
  },
  icons: {
    icon: 'https://madebyjet.dev/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}