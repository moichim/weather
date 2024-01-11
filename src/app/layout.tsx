import { cn } from '@nextui-org/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/providers'
import './globals.css'
import { NotificationListing } from '@/components/notifications/notificationListing'
import { getMetadataTitle } from '@/utils/metadata'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: getMetadataTitle(),
  description: 'GUI pro meteostanici.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className={cn([
          inter.className,
          "h-[100vh]"
        ])}>
          <Providers>
            {children}
            <NotificationListing />
          </Providers>
        </div>
      </body>
    </html>
  )
}
