"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { cdn } from "@/lib/cdn"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap, Globe, Lock, BarChart3, Users } from "lucide-react"

export default function TransfersPage() {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-3 md:mb-4 text-xs md:text-sm">
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Lightning-Fast Transfers</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">Sub-2-second settlements with zero hidden fees</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-8 md:space-y-12">
        {/* Hero */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">
              Money Moves at <span className="text-primary">Light Speed</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Send money instantly to anyone, anywhere. No delays. No surprises. Just transparent, lightning-fast transfers that actually work.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "Sub-2-second settlement",
                "Peer-to-peer & batch transfers",
                "160+ countries supported",
                "Transparent, low fees",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base w-full sm:w-auto">
              Start Transferring <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={cdn("global-transfers.svg")}
              alt="Global Transfers - Lightning Fast Money Movement"
              className="w-full max-w-sm mx-auto drop-shadow-lg rounded-lg md:rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* User Experience Showcase */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">Secure, Simple, Powerful</h3>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Transfer money with confidence using our state-of-the-art platform. Whether you're sending funds to family, paying vendors, or managing business payments—we make it effortless.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "One-click transfers to saved recipients",
                "Fraud detection with AI monitoring",
                "Transparent exchange rates",
                "Instant payment confirmations",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-3">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={cdn("features-2.png")}
              alt="BeaconBank Mobile Payments - Secure Transfers"
              className="w-full max-w-sm mx-auto drop-shadow-lg rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Transfer Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Zap,
                title: "Instant Transfers",
                description: "Send money to recipients in seconds, not days.",
              },
              {
                icon: Users,
                title: "Batch Transfers",
                description: "Send to multiple recipients at once. Perfect for payroll.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Transfer to 160+ countries with multi-currency support.",
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "256-bit encryption on all transfers. Your money is safe.",
              },
              {
                icon: BarChart3,
                title: "Real-Time Tracking",
                description: "See exactly where your money is at every moment.",
              },
              {
                icon: Zap,
                title: "Scheduled Transfers",
                description: "Set it and forget it. Automate recurring payments.",
              },
            ].map((feature, i) => (
              <Card key={i} className="feature-card border-border/50 active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mb-2" />
                  <CardTitle className="text-sm md:text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transfer Types */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 border border-primary/20">
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Transfer Types We Support</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {[
              {
                title: "Peer-to-Peer",
                description: "Send money directly to friends, family, or colleagues",
                features: ["Direct bank transfers", "Email transfers", "Phone transfers"],
              },
              {
                title: "Business Transfers",
                description: "Payments to vendors, contractors, and suppliers",
                features: ["Invoice-based payments", "Vendor management", "Payment records"],
              },
              {
                title: "Batch Transfers",
                description: "Send to multiple recipients in one go",
                features: ["CSV import", "Template support", "Bulk processing"],
              },
              {
                title: "International",
                description: "Cross-border transfers with competitive rates",
                features: ["Multi-currency", "Low fees", "Real-time rates"],
              },
            ].map((type, i) => (
              <Card key={i} className="feature-card bg-background/50 active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">{type.title}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, j) => (
                      <li key={j} className="text-xs md:text-sm text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
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
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4">Ready to Send Faster?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands sending money instantly. No delays, no drama, just fast transfers.
          </p>
          <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base">
            Make Your First Transfer <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
