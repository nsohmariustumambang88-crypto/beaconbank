"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { saveSession } from "@/lib/session"

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".login-card",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const attempt = () =>
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
      let res = await attempt()
      if (res.status >= 500) {
        await new Promise((r) => setTimeout(r, 2000))
        res = await attempt()
      }
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error || "Login failed")
        return
      }
      saveSession(json.data.token, json.data.user)
      router.push(json.data.user.role === "admin" ? "/admin" : "/dashboard")
    } catch {
      setError("Could not reach the server. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef}>
      <Card className="login-card border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader className="space-y-2 pb-4 md:pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm md:text-base">🏦</span>
            </div>
            <span className="font-semibold text-base md:text-lg">BeaconBank</span>
          </div>
          <CardTitle className="text-lg md:text-xl">Welcome Back</CardTitle>
          <CardDescription className="text-xs md:text-sm">Sign in to your BeaconBank account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs md:text-sm font-medium">Email or username</label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 touch-target"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs md:text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 touch-target"
              />
            </div>
            {error && <p className="text-xs md:text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full h-10 md:h-11 text-sm md:text-base">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-xs md:text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
