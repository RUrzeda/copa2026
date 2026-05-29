import { GitBranch } from 'lucide-react'
import { useData } from '../hooks/useData'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { TeamFlag } from '../components/ui/TeamFlag'
import { Badge } from '../components/ui/Badge'
import { isMatchFinished, isMatchLive, formatScore } from '../utils/helpers'
import type { Match } from '../types'
import clsx from 'clsx'

function BracketMatch({ match, size = 'md' }: { match: Match | null; size?: 'sm' | 'md' }) {
  if (!match) {
    return (
      <div className={clsx(
        'border border-dashed border-navy-600 rounded-xl flex items-center justify-center text-slate-700 text-xs',
        size === 'sm' ? 'h-12' : 'h-16'
      )}>
        A definir
      </div>
    )
  }

  const live = isMatchLive(match.status)
  const finished = isMatchFinished(match.status)
  const homeWon = match.score.winner === 'HOME_TEAM'
  const awayWon = match.score.winner === 'AWAY_TEAM'

  return (
    <div className={clsx(
      'border rounded-xl overflow-hidden transition-all',
      live ? 'border-red-500/30 shadow-lg shadow-red-500/5' : 'border-navy-700/70',
      size === 'sm' ? 'text-xs' : 'text-sm'
    )}>
      {/* Home */}
      <div className={clsx(
        'flex items-center gap-2 px-3',
        size === 'sm' ? 'py-1.5' : 'py-2',
        homeWon ? 'bg-pitch-500/10' : 'bg-navy-800/60',
        'border-b border-navy-700/50'
      )}>
        <TeamFlag crest={match.homeTeam.crest} name={match.homeTeam.name} size="xs" />
        <span className={clsx('flex-1 truncate font-medium', homeWon ? 'text-white' : 'text-slate-400')}>
          {match.homeTeam.tla}
        </span>
        {(finished || live) && (
          <span className={clsx('font-bold tabular-nums', homeWon ? 'text-white' : 'text-slate-500')}>
            {match.score.fullTime.home}
          </span>
        )}
      </div>
      {/* Away */}
      <div className={clsx(
        'flex items-center gap-2 px-3',
        size === 'sm' ? 'py-1.5' : 'py-2',
        awayWon ? 'bg-pitch-500/10' : 'bg-navy-800/60',
      )}>
        <TeamFlag crest={match.awayTeam.crest} name={match.awayTeam.name} size="xs" />
        <span className={clsx('flex-1 truncate font-medium', awayWon ? 'text-white' : 'text-slate-400')}>
          {match.awayTeam.tla}
        </span>
        {(finished || live) && (
          <span className={clsx('font-bold tabular-nums', awayWon ? 'text-white' : 'text-slate-500')}>
            {match.score.fullTime.away}
          </span>
        )}
      </div>
    </div>
  )
}

function RoundColumn({ title, matches, size = 'md' }: {
  title: string
  matches: (Match | null)[]
  size?: 'sm' | 'md'
}) {
  return (
    <div className="flex flex-col flex-shrink-0" style={{ width: size === 'sm' ? 140 : 168 }}>
      <div className="text-center mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex flex-col gap-2 justify-around flex-1">
        {matches.map((match, i) => (
          <BracketMatch key={match?.id ?? i} match={match} size={size} />
        ))}
      </div>
    </div>
  )
}

export function KnockoutPage() {
  const { data, loading } = useData()

  if (loading) return <LoadingSpinner />

  const matches = data?.matches ?? []
  const r32 = matches.filter(m => m.stage === 'ROUND_OF_32')
  const r16 = matches.filter(m => m.stage === 'ROUND_OF_16')
  const qf = matches.filter(m => m.stage === 'QUARTER_FINALS')
  const sf = matches.filter(m => m.stage === 'SEMI_FINALS')
  const third = matches.filter(m => m.stage === 'THIRD_PLACE')
  const final = matches.filter(m => m.stage === 'FINAL')

  const hasKnockout = r32.length > 0 || r16.length > 0 || qf.length > 0 || sf.length > 0 || final.length > 0

  const pad = <T,>(arr: T[], len: number): (T | null)[] => [
    ...arr,
    ...Array(Math.max(0, len - arr.length)).fill(null)
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Fase Eliminatória</h1>
        <p className="text-slate-500 text-sm">Oitavas → Quartas → Semis → Final</p>
      </div>

      {!hasKnockout ? (
        <div className="text-center py-24 text-slate-600">
          <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-semibold mb-1">Fase eliminatória ainda não começou</p>
          <p className="text-sm">Disponível após a conclusão da fase de grupos</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start gap-4 min-w-max px-2" style={{ minHeight: 600 }}>
            {r32.length > 0 && (
              <RoundColumn title="Oitavas" matches={pad(r32, 16)} size="sm" />
            )}
            {r16.length > 0 && (
              <RoundColumn title="Oitavas de Final" matches={pad(r16, 8)} />
            )}
            {qf.length > 0 && (
              <RoundColumn title="Quartas de Final" matches={pad(qf, 4)} />
            )}
            {sf.length > 0 && (
              <RoundColumn title="Semifinais" matches={pad(sf, 2)} />
            )}

            {/* Center: Final + 3rd Place */}
            <div className="flex flex-col gap-4 flex-shrink-0 w-44">
              <div>
                <div className="text-center mb-3">
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">🏆 Final</span>
                </div>
                <BracketMatch match={final[0] ?? null} />
              </div>
              <div>
                <div className="text-center mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3º Lugar</span>
                </div>
                <BracketMatch match={third[0] ?? null} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-4 bg-navy-800/30 rounded-xl border border-navy-700 flex flex-wrap gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-pitch-500/20 border border-pitch-500/30" />
          Vencedor
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-500/10 border border-red-500/20" />
          Jogo ao vivo
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded border border-dashed border-navy-600" />
          Aguardando classificação
        </div>
      </div>
    </div>
  )
}
