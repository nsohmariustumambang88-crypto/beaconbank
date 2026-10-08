"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Shield, TrendingUp, RefreshCw } from "lucide-react"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )

      // Hero subtitle animation
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
      )

      // CTA buttons animation
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "back.out" }
      )

      // Feature cards stagger animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "power2.out" }
      )

      // Floating animation for accent elements
      gsap.fromTo(
        ".float-animation",
        { y: 0 },
        { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" }
      )

      // Hover effects
      const cards = document.querySelectorAll(".feature-card")
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -8, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)", duration: 0.3 })
        })
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", duration: 0.3 })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏦</span>
            </div>
            <span className="font-semibold text-lg text-foreground">BeaconBank</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Features
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div className="space-y-8">
            <div>
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Trusted
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Financial
                </span>
                <br />
                Guidance
              </h1>
            </div>

            <p className="hero-subtitle text-lg text-muted-foreground max-w-lg leading-relaxed">
              BeaconBank is a comprehensive banking SaaS platform specializing in secure transfers, intelligent fund recovery, and effortless refund management.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2">
                Open Account <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="relative">
            <div className="float-animation absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-primary">Expert Financial Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Secure Transfers & Storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Smart Refund Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Fund Recovery Services</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for secure, transparent financial operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "💳",
              title: "Digital Wallet",
              description: "Multi-currency accounts with instant access to your funds",
            },
            {
              icon: "🔄",
              title: "Fast Transfers",
              description: "Peer-to-peer and batch transfers with sub-second settlement",
            },
            {
              icon: "🔍",
              title: "Fund Recovery",
              description: "AI-powered fraud detection and dispute resolution",
            },
            {
              icon: "↩️",
              title: "Smart Refunds",
              description: "Automated refund processing and tracking",
            },
            {
              icon: "🏪",
              title: "Marketplace",
              description: "Integrated marketplace for merchants and sellers",
            },
            {
              icon: "🛡️",
              title: "Security",
              description: "Military-grade encryption and compliance automation",
            },
          ].map((feature, i) => (
            <Card key={i} className="feature-card border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-3">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 md:p-20 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to experience transparent banking?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of users who trust BeaconBank for their financial needs.
          </p>
          <Button size="lg" className="gap-2">
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2026 BeaconBank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
