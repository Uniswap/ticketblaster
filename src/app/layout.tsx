import '../styles/globals.scss'

export const metadata = {
  title: 'TicketBlaster',
  description: 'easy ticket management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
