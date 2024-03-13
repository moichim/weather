import { Link, cn } from '@nextui-org/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/providers'
import './globals.css'
import { NotificationListing } from '@/components/notifications/notificationListing'
import { getMetadataTitle } from '@/utils/metadata'
import { RegistryContextProvider } from '@/thermal/context/RegistryContext'
import { Navbar } from '@/components/navigation/utils/Navbar'

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
            <RegistryContextProvider>
              <Navbar
                brandContent={<Link href="/" color="foreground" className="font-bold">LabIR Edu</Link>}
                endContent={<>
                  <Link href="https://github.com/moichim/weather" isBlock color="primary" isExternal showAnchorIcon size='sm'>Github</Link>
                  <Link href="" isBlock color="primary" isExternal showAnchorIcon size='sm'>Discord</Link>
                </>}
                links={[
                  {
                    text: "Neaktivní",
                    href: "/lrc",
                  },
                  {
                    text: "Aktivní",
                    href:"/"
                  },
                  {
                    text: "Submenu",
                    href: "/lrc",
                    links: [
                      {
                        text: "Neaktivní",
                        href: "/lrc",
                      },
                      {
                        text: "Neaktivní",
                        href: "/",
                      },
                    ]
                  },
                ]}
              />
              {children}
              <NotificationListing />
            </RegistryContextProvider>
          </Providers>
        </div>
      </body>
    </html>
  )
}
