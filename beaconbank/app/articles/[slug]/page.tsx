import { Suspense } from "react"
import { connection } from "next/server"
import { ArticleView } from "@/components/article-view"

async function ArticleLoader({ params }: { params: Promise<{ slug: string }> }) {
  await connection()
  const { slug } = await params
  return <ArticleView slug={slug} />
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Loading…</p>}>
      <ArticleLoader params={params} />
    </Suspense>
  )
}
