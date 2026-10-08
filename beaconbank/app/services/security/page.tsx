"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Security & Compliance</h1>
          <p className="text-muted-foreground mt-2">Bank-grade security with regulatory compliance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Hero */}
        <div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Your Security is <span className="text-primary">Our Priority</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Military-grade encryption, real-time fraud detection, and regulatory compliance. Your funds and data are protected by the highest industry standards.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "256-bit AES encryption",
                "24/7 fraud monitoring",
                "2FA and biometric authentication",
                "SOC 2 Type II & ISO 27001 certified",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gap-2">
              Learn More <ArrowLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle>Security Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Uptime Guarantee</p>
                <p className="text-2xl font-bold text-foreground">99.99%</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Security Audit Frequency</p>
                <p className="text-2xl font-bold text-foreground">Quarterly</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Years in Business</p>
                <p className="text-2xl font-bold text-primary">3+</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Features */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8">Security Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Compliance */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-8">Regulatory Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Card key={i} className="feature-card bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">{item.standard}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Protection */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-8">Your Protection Guarantee</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Insurance Coverage</h4>
              <ul className="space-y-3">
                {[
                  "FDIC insurance up to $250K per account",
                  "Cyber liability insurance $100M+",
                  "Error & omissions insurance",
                  "24/7 breach response team",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Security Best Practices</h4>
              <ul className="space-y-3">
                {[
                  "Regular penetration testing",
                  "Annual third-party audits",
                  "Bug bounty program ($10K-$50K rewards)",
                  "Zero-knowledge architecture",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Bank with Confidence</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your security is non-negotiable. We use the same encryption banks use. Your money is safe with BeaconBank.
          </p>
          <Button size="lg" className="gap-2">
            Read Our Security Report <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
