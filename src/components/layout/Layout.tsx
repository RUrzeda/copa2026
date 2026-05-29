import { type ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-navy-950 bg-pitch-pattern text-slate-100 flex flex-col">
      <Header />
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  )
}
