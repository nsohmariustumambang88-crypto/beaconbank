"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Globe, Eye, TrendingUp, Lock } from "lucide-react"

export default function WalletPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-section", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      gsap.fromTo(".feature-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Digital Wallet & Accounts</h1>
          <p className="text-muted-foreground mt-2">Multi-currency accounts with instant access</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Hero */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Your Money, <span className="text-primary">Anywhere</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Hold multiple currencies, track spending, and manage your finances all in one secure digital wallet. No minimums, no hidden fees.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Multi-currency accounts (USD, EUR, GBP, more)",
                "Real-time balance & transaction tracking",
                "Instant notifications on every move",
                "Bank-level security & insurance",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2">
              Open Your Wallet <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <img
            src="/images/wallet-currencies.svg"
            alt="Multi-Currency Wallet - USD, EUR, GBP Support"
            className="w-full drop-shadow-lg rounded-2xl"
            loading="lazy"
          />
        </div>

        {/* Currencies */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8">Supported Currencies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "SGD", "HKD", "INR", "MXN", "BRL"].map((curr, i) => (
              <Card key={i} className="feature-card border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-2xl font-bold text-primary">{curr}</p>
                  <p className="text-xs text-muted-foreground mt-2">Real-time rates</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8">Wallet Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Global Transactions",
                description: "Send and receive money in any supported currency instantly.",
              },
              {
                icon: TrendingUp,
                title: "Spending Insights",
                description: "Track spending by category and get personalized insights.",
              },
              {
                icon: Lock,
                title: "Fraud Protection",
                description: "Real-time monitoring and instant alerts for suspicious activity.",
              },
              {
                icon: Eye,
                title: "Instant Visibility",
                description: "See your balance and all transactions in real-time.",
              },
              {
                icon: CreditCard,
                title: "Virtual Cards",
                description: "Generate virtual card numbers for online shopping (coming soon).",
              },
              {
                icon: TrendingUp,
                title: "Interest Earnings",
                description: "Earn interest on your USD balance (up to 4% APY).",
              },
            ].map((feature, i) => (
              <Card key={i} className="feature-card border-border/50">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Account Types */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-8">Choose Your Account Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Personal",
                features: ["Multi-currency support", "Instant transfers", "Spending insights", "No monthly fees"],
              },
              {
                name: "Business",
                features: ["Team management", "Bulk transfers", "Advanced reporting", "Priority support"],
              },
              {
                name: "Premium",
                features: ["Everything in Business", "Interest earnings", "Dedicated account manager", "Custom integrations"],
              },
            ].map((accountType, i) => (
              <Card key={i} className="feature-card bg-background/50">
                <CardHeader>
                  <CardTitle className="text-lg">{accountType.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {accountType.features.map((feature, j) => (
                      <li key={j} className="text-sm text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Open Your Wallet Today</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started in minutes. No documents needed for personal accounts. Multi-currency at your fingertips.
          </p>
          <Button size="lg" className="gap-2">
            Create Account <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
