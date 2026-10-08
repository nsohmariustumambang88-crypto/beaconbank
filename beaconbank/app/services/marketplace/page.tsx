"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Store, ShoppingCart, TrendingUp, Users, Zap } from "lucide-react"

export default function MarketplacePage() {
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Integrated Marketplace</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">Buy, sell, and grow your business with confidence</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-8 md:space-y-12">
        {/* Hero */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">
              Your Store, <span className="text-primary">Your Way</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Create an integrated storefront within BeaconBank. Manage inventory, process payments, and track orders all in one place. Zero commission on first 10K in sales.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "Zero commission on first $10,000",
                "Built-in payment processing",
                "Inventory management system",
                "Customer relationship tools",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <Store className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base w-full sm:w-auto">
              Launch Your Store <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/images/marketplace-stores.svg"
              alt="Integrated Marketplace - 2,500+ Active Sellers"
              className="w-full max-w-sm mx-auto drop-shadow-lg rounded-lg md:rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Seller Features */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Seller Tools & Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: ShoppingCart,
                title: "Store Management",
                description: "Create and customize your storefront. List products instantly.",
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description: "Track sales, revenue, and customer behavior in real-time.",
              },
              {
                icon: Users,
                title: "Customer Relations",
                description: "Manage customer inquiries and build lasting relationships.",
              },
              {
                icon: Zap,
                title: "Automated Orders",
                description: "Order processing, fulfillment tracking, and automation.",
              },
              {
                icon: Store,
                title: "Inventory System",
                description: "Manage stock across multiple warehouses and locations.",
              },
              {
                icon: TrendingUp,
                title: "Marketing Tools",
                description: "Built-in promotions, discounts, and email marketing.",
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

        {/* Commission Structure */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 border border-primary/20">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">Simple Pricing - No Hidden Fees</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                range: "First $10,000",
                commission: "0%",
                description: "Launch your store free",
              },
              {
                range: "$10,001 - $50,000",
                commission: "1.5%",
                description: "Growing seller rate",
              },
              {
                range: "$50,000+",
                commission: "1%",
                description: "Volume discount",
              },
            ].map((tier, i) => (
              <Card key={i} className="feature-card bg-background/50 active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <CardTitle className="text-sm md:text-lg">{tier.range}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl md:text-3xl font-bold text-primary mb-2">{tier.commission}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{tier.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Seller Success Stories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                name: "Sarah's Handmade Crafts",
                sales: "$125K",
                growth: "+340%",
                quote: "BeaconBank marketplace made it so easy to start selling. No setup fees, instant payments!",
              },
              {
                name: "Tech Gadgets Inc",
                sales: "$890K",
                growth: "+220%",
                quote: "The inventory management system alone saves us hours every week.",
              },
              {
                name: "Wellness Co",
                sales: "$340K",
                growth: "+410%",
                quote: "Customer insights from the dashboard help us make smarter business decisions.",
              },
            ].map((story, i) => (
              <Card key={i} className="feature-card bg-card/50 active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base">{story.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg md:text-2xl font-bold text-primary">{story.sales}</span>
                    <span className="text-xs md:text-sm font-semibold text-green-600">{story.growth}</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground italic">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4">Ready to Sell?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Launch your store today. Zero commission on your first $10K in sales. Everything you need to succeed.
          </p>
          <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base">
            Start Selling <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
