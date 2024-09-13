import './globals.css'
import { Audiowide, Saira_Stencil_One } from 'next/font/google'

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const sairaStencilOne = Saira_Stencil_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Pomodoro Timer',
  description: 'A simple Pomodoro timer application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${audiowide.className} ${sairaStencilOne.variable}`}>
      <head>
        <style>{`
          h1 {
            font-family: var(--font-saira-stencil-one);
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
