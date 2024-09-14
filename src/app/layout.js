import './globals.css'
import { Black_Ops_One } from 'next/font/google'

const blackOpsOne = Black_Ops_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-black-ops-one',
})

export const metadata = {
  title: 'Pomodoro Timer',
  description: 'A simple Pomodoro timer application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={blackOpsOne.variable}>
      <head>
        <link rel="preload" as="image" href="/images/night.webp" />
      </head>
      <body className={blackOpsOne.className}>{children}</body>
    </html>
  )
}
