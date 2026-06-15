import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Garaje Boost AI — Reserva tu plaza',
  description:
    'Encuentro presencial de IA aplicada para equipos de diseño, data y tecnología. Madrid, 17 de junio de 2026.',
  openGraph: {
    title:       'Garaje Boost AI — Reserva tu plaza',
    description: 'IA aplicada, en un solo día. Madrid · 17.06.2026',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  )
}
