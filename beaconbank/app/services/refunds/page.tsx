"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Clock, Zap, BarChart3 } from "lucide-react"

export default function RefundsPage() {
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Refund Management</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">Streamline refunds with intelligent automation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">
              Effortless <span className="text-primary">Refund Processing</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Automate your refund workflows. Send refunds instantly, track every transaction, and keep customers happy with transparent communication.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "Instant refund processing",
                "Partial and full refund support",
                "Scheduled refunds for future dates",
                "Automated customer notifications",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base w-full sm:w-auto">
              Process Refund <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/images/refund-automation.svg"
              alt="Automated Refund Processing - Fast Payments"
              className="w-full max-w-sm mx-auto drop-shadow-lg rounded-lg md:rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Powerful Refund Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                icon: Zap,
                title: "Instant Processing",
                description: "Process refunds in seconds. Funds reach customers immediately.",
              },
              {
                icon: Clock,
                title: "Scheduled Refunds",
                description: "Schedule refunds for specific dates. Automate recurring refund patterns.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track refund trends, reasons, and customer impact with detailed reports.",
              },
              {
                icon: CheckCircle2,
                title: "Bulk Operations",
                description: "Process hundreds of refunds in one click with CSV upload.",
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

        {/* Refund Types */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Refund Types Supported</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: "Full Refunds", description: "Complete refund of transaction amount" },
              { title: "Partial Refunds", description: "Refund specific portions of orders" },
              { title: "Store Credits", description: "Issue as credit for future purchases" },
              { title: "Scheduled Refunds", description: "Set refunds for future dates" },
              { title: "Recurring Refunds", description: "Automate refund patterns" },
              { title: "Batch Processing", description: "Handle multiple refunds at once" },
            ].map((type, i) => (
              <Card key={i} className="feature-card active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 border border-primary/20">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">Seamless Integration</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 leading-relaxed">
            Works with all major payment processors and platforms. API-first design means you can integrate refunds into any workflow.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {["Stripe", "PayPal", "Square", "Adyen", "Shopify", "WooCommerce", "Custom API", "Webhooks"].map((integration, i) => (
              <div key={i} className="flex items-center justify-center p-2 md:p-3 rounded-lg bg-background/50 border border-border/40">
                <span className="text-xs md:text-sm font-medium text-foreground text-center">{integration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4">Ready to Automate Refunds?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Start processing refunds smarter today. Reduce manual work, improve customer satisfaction.
          </p>
          <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base">
            Enable Refunds <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
