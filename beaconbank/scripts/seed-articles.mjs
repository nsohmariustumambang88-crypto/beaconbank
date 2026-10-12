import { createRequire } from "module"
import path from "path"
import { fileURLToPath } from "url"
import { config } from "dotenv"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
config({ path: path.join(root, ".env.local") })
const require = createRequire(path.join(root, "package.json"))
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const articles = [
  {
    slug: "online-payment-security",
    title: "Online Payment Security",
    category: "Security",
    image: "blog-1.jpg",
    excerpt: "Simple habits that protect you when paying online.",
    body: "Only enter card details on sites you reached yourself, and check that the address starts with https.\n\nTurn on two-factor authentication for your bank and email accounts. Never share one-time codes, even with someone claiming to be from your bank.\n\nReview your statements regularly. Report anything unfamiliar right away, because early reports make recovery easier.",
  },
  {
    slug: "team-financial-planning",
    title: "Team Financial Planning",
    category: "Business",
    image: "blog-2.jpg",
    excerpt: "How teams can share budgets without losing control.",
    body: "Give each team a clear budget and an owner who approves spending. Shared rules work better than case-by-case decisions.\n\nUse separate accounts or sub-wallets for projects so costs are easy to trace.\n\nReview spending monthly with the whole team. Small, regular reviews catch problems before they grow.",
  },
  {
    slug: "smart-money-management",
    title: "Smart Money Management",
    category: "Personal Finance",
    image: "blog-3.jpg",
    excerpt: "A practical starting point for budgeting and saving.",
    body: "Write down what comes in and what goes out for one month. Seeing the real numbers is the first step.\n\nSet aside a small amount for savings before spending on anything else, even if it is only a few dollars.\n\nRevisit your plan every few months. Your budget should change as your income and goals change.",
  },
  {
    slug: "digital-payment-trends",
    title: "Digital Payment Trends",
    category: "Technology",
    image: "blog-4.jpg",
    excerpt: "The shift toward instant and mobile payments, and what it means for you.",
    body: "More payments now happen on phones, and many settle within seconds. Faster payments also mean mistakes and fraud can happen faster.\n\nKeep your devices updated and use biometric login where it is offered.\n\nWatch for requests that pressure you to pay quickly. Legitimate providers rarely do.",
  },
  {
    slug: "secure-banking-guide",
    title: "Secure Banking Guide",
    category: "Security",
    image: "blog-5.jpg",
    excerpt: "Protect your accounts with strong passwords and alerts.",
    body: "Use a unique password for every financial account. A password manager makes this practical.\n\nTurn on transaction alerts so you see every movement as it happens.\n\nNever approve a payment you did not start, and contact support if something looks wrong.",
  },
  {
    slug: "international-transfers",
    title: "International Transfers",
    category: "Global Finance",
    image: "blog-6.jpg",
    excerpt: "What to check before sending money across borders.",
    body: "Compare the exchange rate and total fees, not just the headline fee.\n\nConfirm the recipient's name and account details before you send. Mistakes in cross-border transfers are hard to reverse.\n\nAllow for timing differences between countries when you need funds by a deadline.",
  },
]

for (const a of articles) {
  await prisma.article.upsert({
    where: { slug: a.slug },
    update: { title: a.title, excerpt: a.excerpt, body: a.body, category: a.category, image: a.image, published: true },
    create: { ...a, published: true },
  })
  console.log("seeded:", a.slug)
}
await prisma.$disconnect()
