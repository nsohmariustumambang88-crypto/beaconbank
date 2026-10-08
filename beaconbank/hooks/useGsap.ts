"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export const useGsap = (callback: (ctx: gsap.Context) => void) => {
  const ctx = useRef<gsap.Context | null>(null)

  useEffect(() => {
    ctx.current = gsap.context(() => {
      callback(ctx.current!)
    })

    return () => ctx.current?.revert()
  }, [callback])

  return ctx.current
}

export const useGsapAnimation = (
  selector: string,
  animation: (element: HTMLElement) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => {
      animation(el as HTMLElement)
    })
  }, deps)
}
