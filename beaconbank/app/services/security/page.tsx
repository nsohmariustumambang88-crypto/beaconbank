"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
import { cdn } from "@/lib/cdn"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lock, Shield, Eye, CheckCircle2, AlertTriangle, Users } from "lucide-react"

export default function SecurityPage() {
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Security & Compliance</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">Bank-grade security with regulatory compliance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-8 md:space-y-12">
        {/* Hero */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <img
            src={cdn("security-illustration.svg")}
            alt="Security & Encryption - Military Grade Protection"
            className="w-full max-w-sm mx-auto drop-shadow-lg rounded-lg md:rounded-2xl order-2 md:order-1"
            loading="lazy"
          />
          <div className="order-1 md:order-2">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">
              Your Security is <span className="text-primary">Our Priority</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Military-grade encryption, real-time fraud detection, and regulatory compliance. Your funds and data are protected by the highest industry standards.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "256-bit AES encryption",
                "24/7 fraud monitoring",
                "2FA and biometric authentication",
                "SOC 2 Type II & ISO 27001 certified",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base w-full sm:w-auto">
              Learn More <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <img
            src={cdn("compliance-badges.svg")}
            alt="Compliance Badges - SOC2, ISO27001, GDPR, PCI DSS"
            className="w-full max-w-sm mx-auto drop-shadow-lg rounded-lg md:rounded-2xl hidden md:block"
            loading="lazy"
          />
        </div>

        {/* Security Features */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Security Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Lock,
                title: "End-to-End Encryption",
                description: "All data encrypted in transit and at rest using 256-bit AES.",
              },
              {
                icon: Shield,
                title: "Fraud Detection AI",
                description: "Machine learning models detect suspicious patterns 24/7.",
              },
              {
                icon: Users,
                title: "Identity Verification",
                description: "KYC/AML compliance with biometric authentication options.",
              },
              {
                icon: Eye,
                title: "Real-Time Monitoring",
                description: "Continuous monitoring with instant alerts on any anomalies.",
              },
              {
                icon: AlertTriangle,
                title: "Risk Management",
                description: "Advanced risk scoring and transaction verification.",
              },
              {
                icon: CheckCircle2,
                title: "Compliance Automation",
                description: "Automated compliance reporting for regulatory requirements.",
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

        {/* Security in Action */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div>
            <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-4 md:mb-6">Your Trust, Our Responsibility</h3>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Every BeaconBank user benefits from military-grade security. Whether you're transferring money, managing accounts, or processing refunds—your data is encrypted and protected 24/7.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "Multi-layer encryption protocols",
                "Biometric & fingerprint security",
                "Instant breach notifications",
                "Zero-knowledge architecture",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-3">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src={cdn("choose-3.jpg")}
              alt="Secure Banking - Credit Card & Mobile Protection"
              className="w-full max-w-sm mx-auto drop-shadow-lg rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Compliance */}
        <div>
          <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-6 md:mb-8">Regulatory Compliance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                standard: "SOC 2 Type II",
                description: "Security, availability, and confidentiality controls certified annually.",
              },
              {
                standard: "ISO 27001",
                description: "International information security management standard.",
              },
              {
                standard: "GDPR Compliant",
                description: "Full compliance with European data protection regulations.",
              },
              {
                standard: "PCI DSS Level 1",
                description: "Highest payment card industry data security standard.",
              },
              {
                standard: "AML/KYC",
                description: "Anti-money laundering and know-your-customer procedures.",
              },
              {
                standard: "Data Residency",
                description: "Multiple geographic options for data storage compliance.",
              },
            ].map((item, i) => (
              <Card key={i} className="feature-card bg-card/50 active:scale-95 md:hover:scale-105 md:transition-transform">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base">{item.standard}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Protection */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 border border-primary/20">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">Your Protection Guarantee</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h4 className="font-semibold text-sm md:text-base text-foreground mb-3 md:mb-4">Insurance Coverage</h4>
              <ul className="space-y-2 md:space-y-3">
                {[
                  "FDIC insurance up to $250K per account",
                  "Cyber liability insurance $100M+",
                  "Error & omissions insurance",
                  "24/7 breach response team",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm md:text-base text-foreground mb-3 md:mb-4">Security Best Practices</h4>
              <ul className="space-y-2 md:space-y-3">
                {[
                  "Regular penetration testing",
                  "Annual third-party audits",
                  "Bug bounty program ($10K-$50K rewards)",
                  "Zero-knowledge architecture",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4">Bank with Confidence</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Your security is non-negotiable. We use the same encryption banks use. Your money is safe with BeaconBank.
          </p>
          <Button size="lg" className="gap-2 h-10 md:h-12 text-sm md:text-base">
            Read Our Security Report <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
