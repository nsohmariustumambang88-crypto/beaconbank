"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Send, Plus, Eye, EyeOff, TrendingUp, CreditCard } from "lucide-react"

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".dashboard-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" })
      gsap.fromTo(".balance-display", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, delay: 0.2 })
      gsap.fromTo(".transaction-item", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, delay: 0.5 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const transactions = [
    { id: 1, type: "sent", name: "Sarah Johnson", amount: "-$250.00", date: "Today", icon: ArrowUpRight },
    { id: 2, type: "received", name: "Client Payment", amount: "+$1,500.00", date: "Yesterday", icon: ArrowDownLeft },
    { id: 3, type: "sent", name: "Bill Payment", amount: "-$89.99", date: "2 days ago", icon: ArrowUpRight },
    { id: 4, type: "received", name: "Refund Processed", amount: "+$345.50", date: "3 days ago", icon: ArrowDownLeft },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your financial overview</p>
          </div>
          <Button>Settings</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Main Balance Card */}
        <Card className="dashboard-card border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Total Balance</CardTitle>
                <CardDescription>Your available funds</CardDescription>
              </div>
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="balance-display space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">
                  {showBalance ? "$24,568.90" : "••••••"}
                </span>
                <button onClick={() => setShowBalance(!showBalance)} className="p-2 hover:bg-muted rounded-lg transition">
                  {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-4 pt-4">
                <Button className="gap-2">
                  <Send className="w-4 h-4" /> Send Money
                </Button>
                <Button className="gap-2" variant="outline">
                  <Plus className="w-4 h-4" /> Add Funds
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Monthly Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">$12,450</p>
              <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Refunds Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">$3,890</p>
              <p className="text-xs text-muted-foreground mt-2">5 active refunds</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground mt-2">USD, EUR, GBP</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="transaction-item flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <tx.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tx.name}</p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${tx.type === "sent" ? "text-foreground" : "text-primary"}`}>
                        {tx.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">🔄 New Transfer</Button>
                <Button variant="outline" className="w-full justify-start">📋 Request Funds</Button>
                <Button variant="outline" className="w-full justify-start">↩️ Track Refunds</Button>
                <Button variant="outline" className="w-full justify-start">🔍 Recover Funds</Button>
              </CardContent>
            </Card>

            <Card className="dashboard-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-foreground">2FA Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-foreground">All Devices Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-foreground">Encryption Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
