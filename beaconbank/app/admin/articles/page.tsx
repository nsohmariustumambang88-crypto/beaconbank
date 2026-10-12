"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authHeaders, clearSession, getToken } from "@/lib/session"

type AdminArticle = { id: string; slug: string; title: string; excerpt: string; body: string; category: string; image: string; published: boolean }

const emptyForm = { title: "", excerpt: "", body: "", category: "", image: "", published: false }

export default function AdminArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<AdminArticle[] | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  async function load() {
    const r = await fetch("/api/admin/articles", { headers: authHeaders() })
    if (r.status === 401) {
      clearSession()
      router.replace("/login")
      return
    }
    if (r.status === 403) {
      setMessage("You do not have admin access.")
      return
    }
    const j = await r.json()
    setArticles(j.data.articles)
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login")
      return
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const url = editingId ? `/api/admin/articles/${editingId}` : "/api/admin/articles"
    const res = await fetch(url, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      setMessage(json.error || json.message || "Could not save article")
      return
    }
    setForm(emptyForm)
    setEditingId(null)
    setMessage(editingId ? "Article updated" : "Article created")
    load()
  }

  function edit(a: AdminArticle) {
    setEditingId(a.id)
    setForm({ title: a.title, excerpt: a.excerpt, body: a.body, category: a.category, image: a.image, published: a.published })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function togglePublished(a: AdminArticle) {
    await fetch(`/api/admin/articles/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ published: !a.published }),
    })
    load()
  }

  async function remove(a: AdminArticle) {
    if (!window.confirm(`Delete "${a.title}"?`)) return
    await fetch(`/api/admin/articles/${a.id}`, { method: "DELETE", headers: authHeaders() })
    load()
  }

  const field = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Articles</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Create, publish, and remove learning hub articles</p>
          </div>
          <Link href="/admin"><Button size="sm" variant="outline" className="h-9 md:h-10 text-xs md:text-sm">Back to admin</Button></Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{editingId ? "Edit article" : "New article"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-3">
              <input className={field} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <input className={field} placeholder="Category (e.g. Security)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <input className={field} placeholder="Image file (e.g. blog-1.jpg)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
              <input className={field} placeholder="Short summary" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
              <textarea className={`${field} min-h-40`} placeholder="Body (separate paragraphs with a blank line)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
              </label>
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
              <div className="flex gap-2">
                <Button type="submit" className="h-10">{editingId ? "Save changes" : "Create article"}</Button>
                {editingId && <Button type="button" variant="outline" className="h-10" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">All articles {articles ? `(${articles.length})` : ""}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!articles && <p className="text-sm text-muted-foreground">Loading…</p>}
            {articles?.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-muted/30">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.category} · {a.published ? "Published" : "Draft"}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => togglePublished(a)}>{a.published ? "Unpublish" : "Publish"}</Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => edit(a)}>Edit</Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs text-destructive" onClick={() => remove(a)}>Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
