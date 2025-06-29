"use client"

import MaxWidthWrapper from "./max-width-wrapper"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { ArrowRight, Brain, Calculator } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

const Navbar = () => {
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-border">
          <Link href="/" className="flex z-40 font-semibold text-2xl">
            hypo<span className="text-primary">stats</span>
          </Link>
          <div className="h-full flex items-center space-x-4">
            <Link
              href="/test"
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
                className: "hidden sm:flex items-center gap-1",
              })}
            >
              <Calculator className="h-4 w-4" />
              Manual Test
            </Link>
            <Link
              href="/test-analyze"
              className={buttonVariants({
                size: "sm",
                className: "hidden sm:flex items-center gap-1",
              })}
            >
              <Brain className="h-4 w-4" />
              AI Analyzer
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
