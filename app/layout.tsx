import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HypoStat - Statistical Hypothesis Testing Made Simple",
  description:
    "Comprehensive statistical hypothesis testing platform supporting T, F, Z, and Chi-square distributions with interactive visualizations.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("relative h-full font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <main className="relative flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow flex-1">{children}</div>
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
