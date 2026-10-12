"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { cdn } from "@/lib/cdn"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-3 md:mb-4 text-xs md:text-sm">
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Fund Recovery Service</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">Recover your lost or disputed funds with expert assistance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <img
            src={cdn("fund-recovery.svg")}
            alt="Fund Recovery Process - Recover Lost Funds"
            className="w-full max-w-sm mx-auto drop-shadow-lg rounded-lg md:rounded-2xl order-2 md:order-1"
            loading="lazy"
          />
          <div className="order-1 md:order-2">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">
              Recover Your <span className="text-primary">Lost Funds</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              With our AI-powered fraud detection and expert recovery specialists, we help you retrieve disputed or fraudulently transferred funds quickly and efficiently.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "Average recovery rate: 87%",
                "Expert fraud investigators",
                "Support for 150+ fraud types",
                "No recovery, no fee policy",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/recovery"><Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base w-full sm:w-auto">
              Start Recovery Process <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button></Link>
          </div>
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 col-span-1">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Recovery Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <p className="text-2xl md:text-4xl font-bold text-primary">$15M+</p>
                <p className="text-xs md:text-sm text-muted-foreground">Funds Recovered</p>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold text-foreground">2,450</p>
                <p className="text-xs md:text-sm text-muted-foreground">Successful Cases</p>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold text-foreground">15 days</p>
                <p className="text-xs md:text-sm text-muted-foreground">Average Resolution Time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real Success Stories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 py-6 md:py-8">
          <Card className="feature-card border-border/50 overflow-hidden">
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img
                src={cdn("choose-1.jpg")}
                alt="Recovery Success Story"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">87% Recovery Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground">Our expert fraud investigators have successfully recovered millions for clients worldwide with proven results.</p>
            </CardContent>
          </Card>
          <Card className="feature-card border-border/50 overflow-hidden">
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img
                src={cdn("blog-6.jpg")}
                alt="International Recovery Support"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Global Recovery Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground">We work with international partners and regulatory bodies to recover funds across borders and jurisdictions.</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">How Our Recovery Process Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
              <Card key={i} className="step-card border-border/50 active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{item.step}</div>
                  <CardTitle className="text-sm md:text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fraud Types We Handle */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Fraud Types We Handle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
              <Card key={i} className="step-card border-border/50 active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    <span className="text-xs md:text-sm text-foreground font-medium">{fraud}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 lg:p-20 border border-primary/20 text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4">Ready to Recover Your Funds?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Contact our fraud specialists today. Free initial consultation. No recovery, no fee.
          </p>
          <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base">
            Start Recovery Claim <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
