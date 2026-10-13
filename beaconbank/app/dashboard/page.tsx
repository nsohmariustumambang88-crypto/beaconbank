"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Send, Eye, EyeOff, CreditCard, Shield } from "lucide-react"
import { authHeaders, clearSession, getToken, getSessionUser, SessionUser } from "@/lib/session"

type Wallet = { id: string; currency: string; balance: string }
type Tx = { id: string; type: string; amount: string; currency: string; status: string; description: string | null; createdAt: string }
type Profile = SessionUser & { kycStatus: string; wallets: Wallet[]; totalBalance: string }

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [showBalance, setShowBalance] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [txTotal, setTxTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login")
      return
    }
    let cancelled = false
    async function load() {
      try {
        const [profileRes, txRes] = await Promise.all([
          fetch("/api/users/profile", { headers: authHeaders() }),
          fetch("/api/transactions/history?limit=10", { headers: authHeaders() }),
        ])
        if (profileRes.status === 401) {
          clearSession()
          router.replace("/login")
          return
        }
        const profileJson = await profileRes.json()
        const txJson = await txRes.json()
        if (cancelled) return
        if (profileJson.success) setProfile({ ...profileJson.data.user, wallets: profileJson.data.wallets, totalBalance: profileJson.data.totalBalance, role: getSessionUser()?.role ?? "user" })
        if (txJson.success) {
          setTransactions(txJson.data.transactions)
          setTxTotal(txJson.data.pagination.total)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.fromTo(".dashboard-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" })
      gsap.fromTo(".balance-display", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, delay: 0.2 })
    }, containerRef)
    return () => ctx.revert()
  }, [loading])

  function logout() {
    clearSession()
    router.replace("/login")
  }

  const firstName = profile?.name?.split(" ")[0] ?? ""
  const primaryWallet = profile?.wallets.find((w) => w.currency === "USD") ?? profile?.wallets[0]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-8 md:pb-12">
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs md:text-sm text-muted-foreground">{firstName ? `Welcome back, ${firstName}` : "Welcome back"}</p>
          </div>
          <div className="flex gap-2">
            {profile?.role === "admin" && (
              <Link href="/admin">
                <Button size="sm" variant="outline" className="h-9 md:h-10 text-xs md:text-sm">Admin</Button>
              </Link>
            )}
            <Button size="sm" variant="outline" onClick={logout} className="h-9 md:h-10 text-xs md:text-sm">Log out</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        <Card className="dashboard-card border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <CardTitle className="text-base md:text-lg text-foreground">Total Balance</CardTitle>
                <CardDescription className="text-xs md:text-sm">Across all your accounts</CardDescription>
              </div>
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="balance-display space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground truncate">
                  {loading ? "…" : showBalance ? `$${Number(profile?.totalBalance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"}
                </span>
                <button onClick={() => setShowBalance(!showBalance)} className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition flex-shrink-0 touch-target" aria-label="Toggle balance visibility">
                  {showBalance ? <Eye className="w-4 h-4 md:w-5 md:h-5" /> : <EyeOff className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
              <div className="flex gap-2 md:gap-4 pt-2 md:pt-4 flex-col xs:flex-row">
                <Link href="/dashboard/transfer" className="flex-1 xs:flex-none">
                  <Button className="gap-2 h-9 md:h-10 text-xs md:text-sm w-full">
                    <Send className="w-3 h-3 md:w-4 md:h-4" /> Send Money
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-xs md:text-sm text-muted-foreground">Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{profile?.wallets.length ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-2">{profile?.wallets.map((w) => w.currency).join(", ") || "None yet"}</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-xs md:text-sm text-muted-foreground">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{txTotal}</p>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-xs md:text-sm text-muted-foreground">Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold text-foreground capitalize">{profile?.kycStatus ?? "—"}</p>
              <Link href="/dashboard/kyc" className="text-xs text-primary hover:underline mt-2 inline-block">{profile?.kycStatus === "verified" ? "View details" : "Verify now"}</Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Recent Transactions</CardTitle>
                <CardDescription className="text-xs md:text-sm">Your latest activity</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-xs md:text-sm text-muted-foreground py-6 text-center">
                    {loading ? "Loading…" : "No transactions yet. Your activity will appear here."}
                  </p>
                ) : (
                  <div className="space-y-2 md:space-y-4">
                    {transactions.map((tx) => {
                      const outgoing = tx.type.endsWith("_out")
                      const Icon = outgoing ? ArrowUpRight : ArrowDownLeft
                      return (
                        <div key={tx.id} className="transaction-item flex items-center justify-between p-3 md:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition gap-3">
                          <div className="flex items-center gap-2 md:gap-4 min-w-0">
                            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                              <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-xs md:text-sm text-foreground truncate">{tx.description || tx.type.replace(/_/g, " ")}</p>
                              <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()} · {tx.status}</p>
                            </div>
                          </div>
                          <p className={`font-semibold text-xs md:text-sm flex-shrink-0 ${outgoing ? "text-foreground" : "text-primary"}`}>
                            {outgoing ? "-" : "+"}${Number(tx.amount).toFixed(2)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3 md:space-y-4">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/transfer"><Button variant="outline" className="w-full justify-start h-9 md:h-10 text-xs md:text-sm">🔄 Transfer</Button></Link>
                <Link href="/dashboard/refund"><Button variant="outline" className="w-full justify-start h-9 md:h-10 text-xs md:text-sm">↩️ Request refund</Button></Link>
                <Link href="/dashboard/recovery"><Button variant="outline" className="w-full justify-start h-9 md:h-10 text-xs md:text-sm">🔍 Open recovery case</Button></Link>
                <Link href="/dashboard/withdraw"><Button variant="outline" className="w-full justify-start h-9 md:h-10 text-xs md:text-sm">🏦 Withdraw to bank</Button></Link>
                <Link href="/dashboard/kyc"><Button variant="outline" className="w-full justify-start h-9 md:h-10 text-xs md:text-sm">🪪 Verify identity</Button></Link>
                <Link href="/dashboard/store"><Button variant="outline" className="w-full justify-start h-9 md:h-10 text-xs md:text-sm">🏪 Open a store</Button></Link>
              </CardContent>
            </Card>

            <Card className="dashboard-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm md:text-base flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Primary account</CardTitle>
              </CardHeader>
              <CardContent className="text-xs md:text-sm space-y-1">
                <p className="text-foreground">{primaryWallet ? `${primaryWallet.currency} · ${Number(primaryWallet.balance).toFixed(2)}` : "No account yet"}</p>
                <p className="text-muted-foreground">Signed in as {profile?.email}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
