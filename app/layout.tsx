import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { BettingProvider } from "@/context/betting-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Papal Election Betting",
  description: "Place your bets on who will be elected as the next Pope",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <BettingProvider>{children}</BettingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
