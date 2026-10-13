"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { saveSession } from "@/lib/session"

export default function RegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", passwordConfirm: "" })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".register-card",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out" }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!agreed) {
      setError("Please accept the terms to continue")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error && typeof json.error === "string" && json.error.startsWith("{")
          ? Object.values(JSON.parse(json.error)).join(". ")
          : json.error || json.message || "Registration failed")
        return
      }
      saveSession(json.data.token, { ...json.data.user, role: json.data.user.role ?? "user" })
      router.push("/dashboard")
    } catch {
      setError("Could not reach the server. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 touch-target"

  return (
    <div ref={containerRef}>
      <Card className="register-card border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader className="space-y-2 pb-4 md:pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm md:text-base">🏦</span>
            </div>
            <span className="font-semibold text-base md:text-lg">BeaconBank</span>
          </div>
          <CardTitle className="text-lg md:text-xl">Create Account</CardTitle>
          <CardDescription className="text-xs md:text-sm">Join BeaconBank in less than 5 minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs md:text-sm font-medium">Full Name</label>
              <input id="name" type="text" required value={form.name} onChange={update("name")} placeholder="John Doe" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs md:text-sm font-medium">Email</label>
              <input id="email" type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs md:text-sm font-medium">Phone Number</label>
              <input id="phone" type="tel" inputMode="tel" required value={form.phone} onChange={update("phone")} placeholder="+1 555 123 4567" autoComplete="tel" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs md:text-sm font-medium">Password (min. 8 characters)</label>
              <input id="password" type="password" required minLength={8} value={form.password} onChange={update("password")} placeholder="••••••••" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="passwordConfirm" className="text-xs md:text-sm font-medium">Confirm Password</label>
              <input id="passwordConfirm" type="password" required minLength={8} value={form.passwordConfirm} onChange={update("passwordConfirm")} placeholder="••••••••" className={inputClass} />
            </div>
            <div className="flex items-start gap-2 py-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded mt-0.5 w-4 h-4 touch-target"
              />
              <label htmlFor="terms" className="text-xs md:text-sm text-muted-foreground leading-tight">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            {error && <p className="text-xs md:text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full h-10 md:h-11 text-sm md:text-base">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-xs md:text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
