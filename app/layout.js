import './globals.css'

export const metadata = {
  title: 'Beauties.Ai',
  description: 'Beauties.Ai',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <script src="https://cdn.jsdelivr.net/npm/fabric"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
