"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cdn } from "@/lib/cdn"

type ArticleSummary = { slug: string; title: string; excerpt: string; category: string; image: string }

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleSummary[] | null>(null)

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((j) => setArticles(j.success ? j.data.articles : []))
      .catch(() => setArticles([]))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-3 md:mb-4 text-xs md:text-sm">
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learning Hub</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">Guides on security, budgeting, and payments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {articles === null && <p className="text-sm text-muted-foreground">Loading articles…</p>}
        {articles?.length === 0 && <p className="text-sm text-muted-foreground">No articles published yet.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles?.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`}>
              <Card className="h-full overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img src={cdn(a.image)} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <CardHeader>
                  <span className="text-xs text-primary font-medium">{a.category}</span>
                  <CardTitle className="text-base md:text-lg">{a.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">{a.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs md:text-sm text-primary">Read article <ArrowRight className="w-3 h-3" /></span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
