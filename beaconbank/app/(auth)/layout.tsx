export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/5 px-4 py-8">
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}
