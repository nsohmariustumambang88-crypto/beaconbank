"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Search, FileText, DollarSign, Users } from "lucide-react"

export default function FundRecoveryPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-section", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      gsap.fromTo(".step-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3 })
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
          <h1 className="text-3xl font-bold text-foreground">Fund Recovery Service</h1>
          <p className="text-muted-foreground mt-2">Recover your lost or disputed funds with expert assistance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Hero Section */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <img
            src="/images/fund-recovery.svg"
            alt="Fund Recovery Process - Recover Lost Funds"
            className="w-full drop-shadow-lg rounded-2xl order-2 md:order-1"
            loading="lazy"
          />
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Recover Your <span className="text-primary">Lost Funds</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              With our AI-powered fraud detection and expert recovery specialists, we help you retrieve disputed or fraudulently transferred funds quickly and efficiently.
            </p>
            <div className="space-y-4">
              {[
                "Average recovery rate: 87%",
                "Expert fraud investigators",
                "Support for 150+ fraud types",
                "No recovery, no fee policy",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="mt-8 gap-2">
              Start Recovery Process <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle>Recovery Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-4xl font-bold text-primary">$15M+</p>
                <p className="text-muted-foreground">Funds Recovered</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground">2,450</p>
                <p className="text-muted-foreground">Successful Cases</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-foreground">15 days</p>
                <p className="text-muted-foreground">Average Resolution Time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8">How Our Recovery Process Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Submit Claim",
                description: "Tell us about your case with details of the disputed transaction.",
                icon: FileText,
              },
              {
                step: "02",
                title: "Investigation",
                description: "Our experts analyze the case with AI fraud detection tools.",
                icon: Search,
              },
              {
                step: "03",
                title: "Recovery Action",
                description: "We pursue recovery through appropriate legal channels.",
                icon: Users,
              },
              {
                step: "04",
                title: "Fund Return",
                description: "Recovered funds are returned to your account securely.",
                icon: DollarSign,
              },
            ].map((item, i) => (
              <Card key={i} className="step-card border-border/50">
                <CardHeader>
                  <div className="text-3xl font-bold text-primary mb-2">{item.step}</div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fraud Types We Handle */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8">Fraud Types We Handle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Unauthorized transactions",
              "Chargebacks & disputes",
              "Phishing & social engineering",
              "Identity theft",
              "Cryptocurrency fraud",
              "Marketplace scams",
              "Invoice manipulation",
              "Account takeovers",
            ].map((fraud, i) => (
              <Card key={i} className="step-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{fraud}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 md:p-20 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Recover Your Funds?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact our fraud specialists today. Free initial consultation. No recovery, no fee.
          </p>
          <Button size="lg" className="gap-2">
            Start Recovery Claim <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
