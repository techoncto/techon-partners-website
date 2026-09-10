import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Techon Partners',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {children}
    </div>
  )
}
