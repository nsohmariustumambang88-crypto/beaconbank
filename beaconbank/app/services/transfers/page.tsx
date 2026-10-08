"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Lightning-Fast Transfers</h1>
          <p className="text-muted-foreground mt-2">Sub-2-second settlements with zero hidden fees</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Hero */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Money Moves at <span className="text-primary">Light Speed</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Send money instantly to anyone, anywhere. No delays. No surprises. Just transparent, lightning-fast transfers that actually work.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Sub-2-second settlement",
                "Peer-to-peer & batch transfers",
                "160+ countries supported",
                "Transparent, low fees",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2">
              Start Transferring <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle>Transfer Speed Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">BeaconBank</span>
                  <span className="text-primary font-bold">0.8s</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Traditional Banks</span>
                  <span className="text-foreground">1-3 days</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-muted-foreground h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Other Fintech</span>
                  <span className="text-foreground">5-30 min</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-muted-foreground h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8">Transfer Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Transfer Types */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-8">Transfer Types We Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <Card key={i} className="feature-card bg-background/50">
                <CardHeader>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, j) => (
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Send Faster?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands sending money instantly. No delays, no drama, just fast transfers.
          </p>
          <Button size="lg" className="gap-2">
            Make Your First Transfer <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
