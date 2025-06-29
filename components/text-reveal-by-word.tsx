"use client"

import { type FC, type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TextRevealByWordProps {
  text: string
  className?: string
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const [title, setTitle] = useState(0)

  useEffect(() => {
    return scrollYProgress.onChange((progress) => {
      if (progress > 0.8) {
        setTitle(5)
      } else if (progress > 0.6) {
        setTitle(4)
      } else if (progress > 0.4) {
        setTitle(3)
      } else if (progress > 0.2) {
        setTitle(2)
      } else {
        setTitle(1)
      }
    })
  }, [scrollYProgress])

  const words = text.split(" ")

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[400vh] flex justify-center max-w-[1440px] w-full", className)}>
      <div className="sticky top-0 flex h-[25%] w-full items-center justify-center bg-transparent m-3">
        <div className="w-full h-[95%] rounded-3xl absolute">
          {title > 0 ? (
            <div className="w-full flex gap-[5rem] items-center">
              {/* <div className="xl:text-[15rem] opacity-10 flex xl:leading-[12rem] leading-[8rem] md:leading-[11rem] sm:leading-[10rem] md:text-[10rem] sm:text-[7rem] text-[5rem] text-primary/20">
                1
              </div> */}
              <div className="flex flex-col w-[95%]">
                <div className="change uppercase xl:text-[5rem] md:text-[4rem] sm:text-[3.5rem] text-[1rem] text-primary font-black leading-[3rem] sm:leading-[5rem] md:leading-[6rem] lg:leading-[9rem] lg:-mb-4 dark:opacity-15 opacity-35 mt-4">
                  Upload Data
                </div>
                <div className="appear text-muted-foreground text-[0.7rem] sm:text-[1rem]">
                  Simply upload your CSV files or enter data manually with our intuitive interface
                </div>
              </div>
            </div>
          ) : null}

          {title > 1 ? (
            <div className="w-full flex gap-[5rem] items-center">
              {/* <div className="xl:text-[15rem] opacity-10 flex xl:leading-[12rem] leading-[8rem] md:leading-[11rem] sm:leading-[10rem] md:text-[10rem] sm:text-[7rem] text-[5rem] text-primary/20">
                2
              </div> */}
              <div className="flex flex-col w-[95%]">
                <div className="change uppercase xl:text-[5rem] md:text-[4rem] sm:text-[3.5rem] text-[1rem] text-primary font-black leading-[3rem] sm:leading-[5rem] md:leading-[6rem] lg:leading-[9rem] lg:-mb-4 dark:opacity-15 opacity-35">
                  AI Analysis
                </div>
                <div className="appear text-muted-foreground text-[0.7rem] sm:text-[1rem]">
                  Let AI automatically extract test parameters from your hypothesis questions
                </div>
              </div>
            </div>
          ) : null}

          {title > 2 ? (
            <div className="w-full flex gap-[5rem] items-center">
              {/* <div className="xl:text-[15rem] opacity-10 flex xl:leading-[12rem] leading-[8rem] md:leading-[11rem] sm:leading-[10rem] md:text-[10rem] sm:text-[7rem] text-[5rem] text-primary/20">
                3
              </div> */}
              <div className="flex flex-col w-[95%]">
                <div className="change uppercase xl:text-[5rem] md:text-[4rem] sm:text-[3.5rem] text-[1rem] text-primary font-black leading-[3rem] sm:leading-[5rem] md:leading-[6rem] lg:leading-[9rem] lg:-mb-4 dark:opacity-15 opacity-35">
                  Statistical Tests
                </div>
                <div className="appear text-muted-foreground text-[0.7rem] sm:text-[1rem]">
                  Comprehensive support for T, F, Z, and Chi-square distributions with accurate calculations
                </div>
              </div>
            </div>
          ) : null}

          {title > 3 ? (
            <div className="w-full flex gap-[5rem] items-center">
              {/* <div className="xl:text-[15rem] opacity-10 flex xl:leading-[12rem] leading-[8rem] md:leading-[11rem] sm:leading-[10rem] md:text-[10rem] sm:text-[7rem] text-[5rem] text-primary/20">
                4
              </div> */}
              <div className="flex flex-col w-[95%]">
                <div className="change uppercase xl:text-[5rem] md:text-[4rem] sm:text-[3.5rem] text-[1rem] text-primary font-black leading-[3rem] sm:leading-[5rem] md:leading-[6rem] lg:leading-[9rem] lg:-mb-4 dark:opacity-15 opacity-35">
                  Instant Results
                </div>
                <div className="appear text-muted-foreground text-[0.7rem] sm:text-[1rem]">
                  Get detailed statistical analysis with clear conclusions and comprehensive test details
                </div>
              </div>
            </div>
          ) : null}

          {title > 4 ? (
            <div className="w-full flex gap-[5rem] items-center">
              {/* <div className="xl:text-[15rem] opacity-10 flex xl:leading-[12rem] leading-[8rem] md:leading-[11rem] sm:leading-[10rem] md:text-[10rem] sm:text-[7rem] text-[5rem] text-primary/20">
                5
              </div> */}
              <div className="flex flex-col w-[95%]">
                <div className="change uppercase xl:text-[5rem] md:text-[4rem] sm:text-[3.5rem] text-[1rem] text-primary font-black leading-[3rem] sm:leading-[5rem] md:leading-[6rem] lg:leading-[9rem] lg:-mb-4 dark:opacity-15 opacity-35">
                  Professional Grade
                </div>
                <div className="appear text-muted-foreground text-[0.7rem] sm:text-[1rem]">
                  Powered by scipy.stats for research-quality statistical computations you can trust
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <p
          ref={targetRef}
          className="hidden flex-wrap p-5 text-2xl backdrop-blur-lg rounded-2xl font-bold text-black/20 dark:text-white/20 md:text-3xl absolute bottom-[4rem] left-[1rem]"
        >
          {words.map((word, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            )
          })}
        </p>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: any
  range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className="absolute opacity-30">{children}</span>
      <motion.span style={{ opacity: opacity }} className="text-black dark:text-white">
        {children}
      </motion.span>
    </span>
  )
}

export default TextRevealByWord
