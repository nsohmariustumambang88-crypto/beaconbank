"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Shield, TrendingUp, RefreshCw, CheckCircle2, Users, Zap, Lock } from "lucide-react"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState({ users: 0, transactions: 0, recovered: 0 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(".hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      gsap.fromTo(".hero-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" })
      gsap.fromTo(".hero-cta", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: "back.out" })
      gsap.fromTo(".hero-visual", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power2.out" })

      // Floating animation
      gsap.fromTo(".float-animation", { y: 0 }, { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" })

      // Stats counter animations
      gsap.fromTo(".stat-number", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, delay: 1 })

      // Feature cards stagger
      gsap.fromTo(".feature-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.6, ease: "power2.out" })

      // Testimonial animations
      gsap.fromTo(".testimonial-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 1.2 })

      // Hover effects
      document.querySelectorAll(".feature-card, .testimonial-card").forEach((card) => {
        card.addEventListener("mouseenter", () => gsap.to(card, { y: -8, duration: 0.3 }))
        card.addEventListener("mouseleave", () => gsap.to(card, { y: 0, duration: 0.3 }))
      })
    }, containerRef)

    // Animate stat counters
    gsap.to(stats, {
      users: 50000,
      transactions: 2500000,
      recovered: 15000000,
      duration: 2,
      onUpdate: function () {
        setStats({
          users: Math.floor(this.targets()[0].users),
          transactions: Math.floor(this.targets()[0].transactions),
          recovered: Math.floor(this.targets()[0].recovered),
        })
      },
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏦</span>
            </div>
            <span className="font-semibold text-lg text-foreground">BeaconBank</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="#services" className="text-sm hover:text-primary transition">Services</a>
            <a href="#about" className="text-sm hover:text-primary transition">About</a>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Expert
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Financial
                </span>
                <br />
                Guidance
              </h1>
            </div>

            <p className="hero-subtitle text-lg text-muted-foreground max-w-lg leading-relaxed">
              BeaconBank is a comprehensive banking SaaS platform specializing in secure transfers, intelligent fund recovery, and effortless refund management—your trusted guide through every financial decision.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Open Account <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="hero-visual relative">
            <div className="float-animation absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
            <Card className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-primary">Your Financial Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Balance Display */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
                    <p className="text-3xl font-bold text-primary">$24,568.90</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Transfers</p>
                      <p className="text-xl font-semibold text-foreground">247</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Refunds</p>
                      <p className="text-xl font-semibold text-foreground">$3,450</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="text-xs">Send Money</Button>
                    <Button variant="outline" size="sm" className="text-xs">Request Funds</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-y border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="stat-number text-4xl md:text-5xl font-bold text-primary">{stats.users.toLocaleString()}</p>
            <p className="text-muted-foreground mt-2">Active Users</p>
          </div>
          <div className="text-center">
            <p className="stat-number text-4xl md:text-5xl font-bold text-primary">${(stats.transactions / 1000000).toFixed(1)}M</p>
            <p className="text-muted-foreground mt-2">Transactions Processed</p>
          </div>
          <div className="text-center">
            <p className="stat-number text-4xl md:text-5xl font-bold text-primary">${(stats.recovered / 1000000).toFixed(1)}M</p>
            <p className="text-muted-foreground mt-2">Funds Recovered</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Our Range of Expert Financial Solutions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover comprehensive financial services designed to protect your wealth and maximize your opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "💳",
              title: "Digital Wallet & Accounts",
              description: "Multi-currency accounts with instant access, real-time balance tracking, and comprehensive transaction history.",
              link: "/services/wallet"
            },
            {
              icon: "🔄",
              title: "Lightning-Fast Transfers",
              description: "Peer-to-peer and batch transfers with sub-2-second settlement times. Zero hidden fees, transparent pricing.",
              link: "/services/transfers"
            },
            {
              icon: "🔍",
              title: "Fund Recovery Service",
              description: "AI-powered fraud detection, advanced dispute management, and professional fund recovery specialists.",
              link: "/services/recovery"
            },
            {
              icon: "↩️",
              title: "Smart Refund System",
              description: "Automated refund processing, partial refunds, scheduled refunds, and intelligent customer communication.",
              link: "/services/refunds"
            },
            {
              icon: "🏪",
              title: "Integrated Marketplace",
              description: "Buy, sell, and trade with confidence. Integrated merchant tools and inventory management built-in.",
              link: "/services/marketplace"
            },
            {
              icon: "🛡️",
              title: "Security & Compliance",
              description: "Military-grade encryption, KYC/AML verification, 2FA/MFA, and automated compliance reporting.",
              link: "/services/security"
            },
          ].map((service, i) => (
            <Link key={i} href={service.link}>
              <Card className="feature-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Button variant="ghost" size="sm" className="gap-1 p-0">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 md:p-20 border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Journey of Trust & Financial Excellence</h2>
              <p className="text-lg text-muted-foreground mb-8">
                At BeaconBank, we believe transparent, secure financial services should be accessible to everyone. Founded on principles of trust, we've helped thousands of users recover funds, process refunds, and manage their money with confidence.
              </p>
              <div className="space-y-4">
                {[
                  "Client-centric approach in every decision",
                  "Industry-leading security standards",
                  "Transparent pricing, no hidden fees",
                  "24/7 customer support team",
                  "Award-winning fraud detection AI",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Shield, label: "Security First", value: "256-bit Encryption" },
                { icon: Users, label: "Global Reach", value: "160+ Countries" },
                { icon: TrendingUp, label: "Growth", value: "$2.5B Processed" },
                { icon: Zap, label: "Speed", value: "<2s Settlement" },
              ].map((item, i) => (
                <Card key={i} className="bg-card/50 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-semibold text-foreground mt-2">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Thousands Worldwide</h2>
          <p className="text-lg text-muted-foreground">Real stories from real users who've transformed their financial lives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Mitchell",
              role: "Entrepreneur",
              content: "BeaconBank helped me recover $45,000 in disputed transactions. The support team was exceptional—professional, transparent, and results-oriented.",
              rating: 5,
            },
            {
              name: "James Chen",
              role: "Business Owner",
              content: "Managing international payments used to be a nightmare. BeaconBank's transfers are instant and the fees are a fraction of traditional banks.",
              rating: 5,
            },
            {
              name: "Emma Rodriguez",
              role: "Freelancer",
              content: "The refund management system saved me hours of manual work. Plus, their security features give me peace of mind for every transaction.",
              rating: 5,
            },
          ].map((testimonial, i) => (
            <Card key={i} className="testimonial-card border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 md:p-20 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Experience Transparent Banking?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of users who trust BeaconBank for secure transfers, intelligent fund recovery, and hassle-free refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center">
                  <span className="text-white font-bold">🏦</span>
                </div>
                <span className="font-semibold">BeaconBank</span>
              </div>
              <p className="text-sm text-muted-foreground">Trusted financial services for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Digital Wallet</a></li>
                <li><a href="#" className="hover:text-primary">Transfers</a></li>
                <li><a href="#" className="hover:text-primary">Fund Recovery</a></li>
                <li><a href="#" className="hover:text-primary">Refunds</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
                <li><a href="#" className="hover:text-primary">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-muted-foreground">
            <p>© 2026 BeaconBank. All rights reserved. | Secure • Transparent • Trusted</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
