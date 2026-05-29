import { Target, Medal } from 'lucide-react'
import { TeamFlag } from '../components/ui/TeamFlag'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useData } from '../hooks/useData'
import type { Scorer } from '../types'
import clsx from 'clsx'

function ScorerRow({ scorer, rank }: { scorer: Scorer; rank: number }) {
  const top3 = rank <= 3

  return (
    <div className={clsx(
      'flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-navy-800/30',
      rank === 1 ? 'border-gold-500/30 bg-gold-500/5' :
      rank === 2 ? 'border-slate-400/20 bg-slate-400/5' :
      rank === 3 ? 'border-amber-700/20 bg-amber-700/5' :
      'border-navy-700/50 bg-navy-800/10'
    )}>
      {/* Rank */}
      <div className={clsx(
        'w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg flex-shrink-0 border-2',
        rank === 1 ? 'text-gold-400 border-gold-400 bg-gold-400/10' :
        rank === 2 ? 'text-slate-300 border-slate-400 bg-slate-400/10' :
        rank === 3 ? 'text-amber-600 border-amber-700 bg-amber-700/10' :
        'text-slate-600 border-navy-600 bg-transparent'
      )}>
        {rank <= 3 ? <Medal className="h-5 w-5" /> : rank}
      </div>

      {/* Player info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <TeamFlag crest={scorer.team.crest} name={scorer.team.name} size="md" className="flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-semibold text-slate-100 text-base truncate">{scorer.player.name}</div>
          <div className="text-xs text-slate-500">{scorer.team.name} · {scorer.player.nationality}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-center">
          <div className={clsx('font-display font-bold text-3xl', rank === 1 ? 'text-gold-400' : 'text-white')}>
            {scorer.goals}
          </div>
          <div className="text-xs text-slate-600 uppercase tracking-wider">gols</div>
        </div>
        <div className="text-center hidden sm:block">
          <div className="font-semibold text-xl text-slate-300">{scorer.assists}</div>
          <div className="text-xs text-slate-600 uppercase tracking-wider">assists</div>
        </div>
        <div className="text-center hidden md:block">
          <div className="font-semibold text-xl text-slate-400">{scorer.penalties ?? 0}</div>
          <div className="text-xs text-slate-600 uppercase tracking-wider">pênaltis</div>
        </div>
      </div>

      {/* Goals bar */}
      <div className="hidden lg:block w-32">
        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all', rank === 1 ? 'bg-gold-gradient' : 'bg-navy-500')}
            style={{ width: `${Math.min(100, (scorer.goals / (scorer.goals || 1)) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function ScorersPage() {
  const { data, loading } = useData()

  if (loading) return <LoadingSpinner />

  const scorers = data?.scorers ?? []
  const topGoals = scorers[0]?.goals ?? 1

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Artilheiros</h1>
        <p className="text-slate-500 text-sm">{scorers.length} jogadores com gol marcado</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {scorers.slice(0, 3).map((s, i) => (
          <div
            key={s.player.id}
            className={clsx(
              'rounded-xl border p-4 text-center',
              i === 0 ? 'border-gold-500/30 bg-gold-500/5' :
              i === 1 ? 'border-slate-400/20' : 'border-amber-700/20'
            )}
          >
            <TeamFlag crest={s.team.crest} name={s.team.name} size="lg" className="mx-auto mb-2" />
            <div className={clsx('font-display font-bold text-3xl mb-0.5', i === 0 ? 'text-gold-400' : 'text-white')}>
              {s.goals}
            </div>
            <div className="text-sm font-medium text-slate-200 truncate">{s.player.name.split(' ').pop()}</div>
            <div className="text-xs text-slate-600">{s.team.tla}</div>
          </div>
        ))}
      </div>

      {scorers.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum gol marcado ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scorers.map((scorer, i) => (
            <ScorerRow
              key={scorer.player.id}
              scorer={{ ...scorer, goals: scorer.goals }}
              rank={i + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
