import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Provider from '@/app/Provider'
import { Toaster } from '@/components/ui/toaster'
import {
  ClerkProvider,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MechVita Estate',
  description: 'MechVita Estate as a real estate company. Find your dream home and make your dream come true.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          "font-sans antialiased",
          inter.className
        )}>
          <Provider>
            <main className="mx-auto py-4 px-10">
              {children}
            </main>
            <Toaster />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}
