"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Shield, TrendingUp, RefreshCw, CheckCircle2, Users, Zap, Lock, Menu, X } from "lucide-react"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState({ users: 0, transactions: 0, recovered: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const navLinks = [
    { label: "💳 Wallet", href: "/services/wallet" },
    { label: "⚡ Transfers", href: "/services/transfers" },
    { label: "↩️ Refunds", href: "/services/refunds" },
    { label: "🔍 Recovery", href: "/services/recovery" },
    { label: "🏪 Marketplace", href: "/services/marketplace" },
    { label: "🛡️ Security", href: "/services/security" },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center">
              <span className="text-white font-bold text-base md:text-lg">🏦</span>
            </div>
            <span className="font-semibold text-base md:text-lg text-foreground hidden xs:inline">BeaconBank</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-xs lg:text-sm hover:text-primary transition duration-200">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition touch-target"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sign In Button */}
            <Link href="/login" className="hidden sm:block">
              <Button size="sm" className="text-xs md:text-sm py-1.5 md:py-2 h-auto">Sign In</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg hover:bg-muted transition text-sm text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block sm:hidden">
                <Button className="w-full text-sm py-2 h-auto">Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Background */}
      <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/banner.png"
            alt="BeaconBank Hero Background"
            className="w-full h-full object-cover opacity-10"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h1 className="hero-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                  Expert
                  <br />
                  <span className="text-primary">
                    Financial
                  </span>
                  <br />
                  Guidance
                </h1>
              </div>

              <p className="hero-subtitle text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                BeaconBank is a comprehensive banking SaaS platform specializing in secure transfers, intelligent fund recovery, and effortless refund management—your trusted guide through every financial decision.
              </p>

              <div className="hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 md:pt-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="gap-2 w-full h-11 md:h-12 text-sm md:text-base">
                    Open Account <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#services" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-11 md:h-12 text-sm md:text-base">
                    Explore Services
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="hero-visual relative hidden md:block">
              <div className="float-animation absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
              <img
                src="/images/banner.png"
                alt="BeaconBank Platform - Easy Banking"
                className="w-full max-w-md mx-auto drop-shadow-lg rounded-2xl object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 border-y border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div className="text-center">
                <p className="stat-number text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{stats.users.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 md:mt-2">Active Users</p>
              </div>
              <div className="text-center">
                <p className="stat-number text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-primary">${(stats.transactions / 1000000).toFixed(1)}M</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 md:mt-2">Transactions</p>
              </div>
              <div className="text-center">
                <p className="stat-number text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-primary">${(stats.recovered / 1000000).toFixed(1)}M</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 md:mt-2">Recovered</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/images/growth-chart.svg"
              alt="BeaconBank Revenue Growth Chart"
              className="w-full max-w-sm mx-auto drop-shadow-lg rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4">Explore Our Range of Expert Financial Solutions</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover comprehensive financial services designed to protect your wealth and maximize your opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              <Card className="feature-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer h-full active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <div className="text-3xl md:text-4xl mb-3">{service.icon}</div>
                  <CardTitle className="text-base md:text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto text-xs md:text-sm">
                    Learn More <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 lg:p-20 border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">Our Journey of Trust & Financial Excellence</h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                At BeaconBank, we believe transparent, secure financial services should be accessible to everyone. Founded on principles of trust, we've helped thousands of users recover funds, process refunds, and manage their money with confidence.
              </p>
              <div className="space-y-3 md:space-y-4">
                {[
                  "Client-centric approach in every decision",
                  "Industry-leading security standards",
                  "Transparent pricing, no hidden fees",
                  "24/7 customer support team",
                  "Award-winning fraud detection AI",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/images/team-trust.svg"
                alt="Our Journey of Trust - BeaconBank Team"
                className="w-full max-w-xs mx-auto drop-shadow-lg rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories with Real Users */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2 md:mb-4">Real Users, Real Success Stories</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Thousands of people trust BeaconBank with their financial decisions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            {
              name: "Sarah Mitchell",
              role: "Entrepreneur",
              content: "BeaconBank helped me recover $45,000 in disputed transactions. The support team was exceptional—professional, transparent, and results-oriented.",
              rating: 5,
              image: "/images/choose-1.jpg"
            },
            {
              name: "James Chen",
              role: "Business Owner",
              content: "Managing international payments used to be a nightmare. BeaconBank's transfers are instant and the fees are a fraction of traditional banks.",
              rating: 5,
              image: "/images/choose-2.jpg"
            },
            {
              name: "Emma Rodriguez",
              role: "Freelancer",
              content: "The refund management system saved me hours of manual work. Plus, their security features give me peace of mind for every transaction.",
              rating: 5,
              image: "/images/choose-3.jpg"
            },
          ].map((testimonial, i) => (
            <Card key={i} className="testimonial-card border-border/50 bg-card/50 active:scale-95 md:hover:scale-105 md:transition-transform overflow-hidden">
              <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-lg">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
                <div className="flex gap-1 mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm md:text-base text-foreground mb-4 md:mb-6 italic flex-grow">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-xs sm:text-sm md:text-base text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning Hub & Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-2 md:mb-4">Learning Hub & Financial Resources</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Expert insights, tips, and guides to master your finances</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            {
              title: "Online Payment Security",
              category: "Security",
              image: "/images/blog-1.jpg",
              description: "Learn how to protect yourself from fraud and secure your online transactions."
            },
            {
              title: "Team Financial Planning",
              category: "Business",
              image: "/images/blog-2.jpg",
              description: "Strategies for managing finances across your entire business team and operations."
            },
            {
              title: "Smart Money Management",
              category: "Personal Finance",
              image: "/images/blog-3.jpg",
              description: "Essential tips for budgeting, saving, and making informed financial decisions."
            },
            {
              title: "Digital Payment Trends",
              category: "Technology",
              image: "/images/blog-4.jpg",
              description: "Stay updated with the latest trends in digital payments and fintech innovations."
            },
            {
              title: "Secure Banking Guide",
              category: "Security",
              image: "/images/blog-5.jpg",
              description: "Complete guide to secure banking practices and protecting your digital assets."
            },
            {
              title: "International Transfers",
              category: "Global Finance",
              image: "/images/blog-6.jpg",
              description: "Master international payments, currency conversion, and global money management."
            },
          ].map((article, i) => (
            <Card key={i} className="feature-card border-border/50 overflow-hidden hover:border-primary/30 transition-colors cursor-pointer active:scale-95 md:hover:scale-105 md:transition-transform">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-base md:text-lg line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">{article.description}</p>
                <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto text-xs md:text-sm">
                  Read Article <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 lg:p-20 border border-primary/20">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4">Ready to Experience Transparent Banking?</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-lg mx-auto leading-relaxed">
            Join thousands of users who trust BeaconBank for secure transfers, intelligent fund recovery, and hassle-free refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto h-11 md:h-12 text-sm md:text-base">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 md:h-12 text-sm md:text-base">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 md:py-12 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs md:text-sm">🏦</span>
                </div>
                <span className="font-semibold text-sm md:text-base">BeaconBank</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Trusted financial services for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-3">Services</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Wallet</a></li>
                <li><a href="#" className="hover:text-primary transition">Transfers</a></li>
                <li><a href="#" className="hover:text-primary transition">Recovery</a></li>
                <li><a href="#" className="hover:text-primary transition">Refunds</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-3">Company</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">About</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-3">Legal</h4>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition">Security</a></li>
                <li><a href="#" className="hover:text-primary transition">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
            <p>© 2026 BeaconBank. All rights reserved. | Secure • Transparent • Trusted</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
