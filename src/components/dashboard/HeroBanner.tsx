import { MapPin, Calendar } from 'lucide-react'
import { CountdownTimer } from '../ui/CountdownTimer'
import { useData } from '../../hooks/useData'
import { getLiveMatches } from '../../utils/helpers'
import { Badge } from '../ui/Badge'

const GOLD_GRADIENT = 'linear-gradient(135deg, #fbbf24 0%, #f0b429 50%, #d97706 100%)'

export function HeroBanner() {
  const { data } = useData()
  const liveMatches = data ? getLiveMatches(data.matches) : []

  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-600 mb-6">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #050d1a 0%, #0d2040 50%, #051020 100%)' }} />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, #f0b429 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 50%, #22c55e 0%, transparent 60%)`,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-white/5" />
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full border border-white/5" />
      <div className="absolute right-20 -bottom-10 w-32 h-32 rounded-full border border-green-500/10" />

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Left: Title */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge label="FIFA World Cup" variant="gold" size="md" />
              {liveMatches.length > 0 && (
                <Badge label={`${liveMatches.length} ao vivo`} variant="live" size="md" pulse />
              )}
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-1">
              Copa do{' '}
              <span style={{ color: '#f0b429' }}>Mundo</span>
            </h1>

            {/* "2026" with gold gradient text using inline styles */}
            <div
              className="font-display font-extrabold leading-none select-none"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                background: GOLD_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >
              2026
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" style={{ color: '#f0b429' }} />
                EUA · Canadá · México
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" style={{ color: '#f0b429' }} />
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

            <div className="flex items-center gap-2 flex-wrap">
              {['48 seleções', '104 jogos', '16 sedes', '3 países'].map((label) => (
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
