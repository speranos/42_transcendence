import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthContextProvider } from './state/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bestgameever',
  description: 'ping pong',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          {children}

        </AuthContextProvider>
        </body>
    </html>
  )
}
