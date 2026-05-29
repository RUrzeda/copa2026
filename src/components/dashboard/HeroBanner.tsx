import { MapPin, Calendar } from 'lucide-react'
import { CountdownTimer } from '../ui/CountdownTimer'
import { useData } from '../../hooks/useData'
import { getLiveMatches, getUpcomingMatches } from '../../utils/helpers'
import { Badge } from '../ui/Badge'

export function HeroBanner() {
  const { data } = useData()
  const liveMatches = data ? getLiveMatches(data.matches) : []
  const nextMatch = data ? getUpcomingMatches(data.matches, 1)[0] : null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-600 mb-6">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, #f0b429 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 50%, #22c55e 0%, transparent 60%)`
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-gold-500/10" />
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full border border-gold-500/10" />
      <div className="absolute right-20 -bottom-10 w-32 h-32 rounded-full border border-pitch-500/10" />

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Left: Title */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge label="FIFA World Cup" variant="gold" size="md" />
              {liveMatches.length > 0 && (
                <Badge label={`${liveMatches.length} ao vivo`} variant="live" size="md" pulse />
              )}
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-2 leading-tight">
              Copa do <span className="text-gold-400">Mundo</span>
            </h1>
            <h2 className="font-display font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gold-gradient leading-none">
              2026
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-500" />
                EUA · Canadá · México
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold-500" />
                11 Jun – 19 Jul 2026
              </div>
            </div>
          </div>

          {/* Right: Countdown */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
                {liveMatches.length > 0 ? 'Copa em andamento' : 'Início da Copa'}
              </p>
              <CountdownTimer />
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: '48 seleções' },
                { label: '104 jogos' },
                { label: '16 sedes' },
                { label: '3 países' },
              ].map(({ label }) => (
                <span
                  key={label}
                  className="text-xs text-slate-400 border border-navy-600 bg-navy-800/50 rounded-full px-3 py-1"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
