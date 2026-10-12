"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cdn } from "@/lib/cdn"

type Article = { slug: string; title: string; excerpt: string; body: string; category: string; image: string; createdAt: string }

export function ArticleView({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/articles/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => (j.success ? setArticle(j.data.article) : setNotFound(true)))
      .catch(() => setNotFound(true))
  }, [slug])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link href="/articles" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition mb-6 text-xs md:text-sm">
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> All articles
        </Link>

        {notFound && <p className="text-sm text-muted-foreground">This article could not be found.</p>}
        {!notFound && !article && <p className="text-sm text-muted-foreground">Loading…</p>}

        {article && (
          <article>
            <p className="text-xs text-primary font-medium mb-2">{article.category}</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{article.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground mb-6">{article.excerpt}</p>
            <img src={cdn(article.image)} alt={article.title} className="w-full rounded-2xl mb-8 object-cover max-h-96" />
            <div className="space-y-4 text-sm md:text-base text-foreground leading-relaxed">
              {article.body.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
