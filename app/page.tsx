"use client"
import { Check, Star } from "lucide-react"
import MaxWidthWrapper from "@/components/max-width-wrapper"
import Footer from "@/components/footer"
import GridDesign from "@/components/grid-design"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { user, logout } = useAuth()
  return (
    <>
      <section className="relative w-screen">
        <div className="hidden lg:block z-50 font-semibold text-8xl rotate-90 absolute top-[38vh] -right-[20vh] text-black/10 dark:text-white/10">
          hypo<span className="text-violet-600/20 dark:text-orange-600/20">stats</span>
        </div>
        <MaxWidthWrapper className="h-[calc(100vh-64px)] w-full flex items-center justify-center">
          <section className="h-full lg:w-3/5 w-full flex flex-col items-center justify-center md:mt-24 xl:mt-0 mt-42">
            <h1
              className="text-4xl mt-0 md:-mt-8 lg:-mt-18 leading-loose lg:text-left text-center lg:text-6xl"
              style={{ lineHeight: "1.6" }}
            >
              Hypothesis Testing made <br className="block lg:hidden" />
              <span className="text-primary-foreground bg-primary px-2 py-1 rounded">Simple</span> & Accurate
            </h1>
            <p className="mt-8 w-full lg:text-lg text-md lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap text-muted-foreground">
              Perform comprehensive statistical hypothesis testing with ease. Upload your data, select your
              distribution, and <span className="font-semibold text-foreground">get instant results</span> with detailed
              analysis. HypoStat supports T, F, Z, and Chi-square distributions with professional-grade accuracy.
            </p>
            <ul className="mt-8 space-y-2 font-medium w-full flex items-center justify-center lg:justify-start">
              <div className="space-y-2">
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  Supports all major statistical distributions.
                </li>
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  Interactive visualizations and detailed reports.
                </li>
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  Real-time calculations with step-by-step explanations.
                </li>
              </div>
            </ul>
            <div className="mt-12 flex flex-col w-full lg:flex-row items-center lg:items-start gap-5">
              <div className="flex -space-x-4">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  className="inline-block h-10 w-10 rounded-full select-none pointer-events-none ring-2 ring-violet-900 dark:ring-orange-900"
                  alt="user image"
                />
                <img
                  src="/placeholder.svg?height=40&width=40"
                  className="inline-block h-10 w-10 rounded-full select-none pointer-events-none ring-2 ring-violet-900 dark:ring-orange-900"
                  alt="user image"
                />
                <img
                  src="/placeholder.svg?height=40&width=40"
                  className="inline-block h-10 w-10 rounded-full select-none pointer-events-none ring-2 ring-violet-900 dark:ring-orange-900"
                  alt="user image"
                />
                <img
                  src="/placeholder.svg?height=40&width=40"
                  className="inline-block select-none pointer-events-none object-cover h-10 w-10 rounded-full ring-2 ring-violet-900 dark:ring-orange-900"
                  alt="user image"
                />
                <img
                  src="/placeholder.svg?height=40&width=40"
                  className="inline-block select-none pointer-events-none object-cover h-10 w-10 rounded-full ring-2 ring-violet-900 dark:ring-orange-900"
                  alt="user image"
                />
              </div>

              <div className="flex flex-col justify-between items-center sm:items-start mt-1 lg:mt-0">
                <div className="flex gap-0.5">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <Star className="h-4 w-4 text-primary fill-primary" />
                </div>
                <p className="text-foreground">
                  <span className="font-semibold">2,850</span> Researchers Trust Us
                </p>
              </div>
            </div>
            {!user ? (
              <div className="lg:self-start mt-8 flex gap-4">
                <Link href="/test">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="bg-background text-foreground">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="lg:self-start mt-8 flex gap-4">
                <Link href="/test">
                  <Button size="lg" className="mt-8">
                    Start Testing
                  </Button>
                </Link>
              </div>
            )}
          </section>
          <section className="h-full w-0 lg:w-2/5"></section>
        </MaxWidthWrapper>
        <section className="min-h-[200vh]">
          <GridDesign />
        </section>
      </section>
      <Footer />
    </>
  )
}
