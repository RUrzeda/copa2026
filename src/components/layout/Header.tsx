import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Trophy, Menu, X, LayoutDashboard, Users, Calendar, GitBranch, Target, BarChart2, Shield } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/grupos', label: 'Grupos', icon: Users },
  { to: '/jogos', label: 'Jogos', icon: Calendar },
  { to: '/eliminatorias', label: 'Eliminatórias', icon: GitBranch },
  { to: '/artilheiros', label: 'Artilheiros', icon: Target },
  { to: '/selecoes', label: 'Seleções', icon: Shield },
  { to: '/estatisticas', label: 'Estatísticas', icon: BarChart2 },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-navy-600 bg-navy-950/95 backdrop-blur-md">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-md group-hover:bg-gold-500/30 transition-all" />
              <div className="relative bg-gold-gradient p-2 rounded-full">
                <Trophy className="h-5 w-5 text-navy-950" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-white text-base leading-tight">
                Copa do Mundo
              </div>
              <div className="text-gold-500 font-bold text-xs tracking-[0.2em] uppercase">
                2026
              </div>
            </div>
            <div className="block sm:hidden">
              <span className="font-display font-bold text-white text-base">Copa <span className="text-gold-500">2026</span></span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800'
                  )
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pitch-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pitch-500" />
              </span>
              Ao vivo
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-navy-800 rounded-lg transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-700 bg-navy-900/98 backdrop-blur-md animate-slide-up">
          <nav className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
