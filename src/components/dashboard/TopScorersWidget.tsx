import { Target, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card, CardHeader } from '../ui/Card'
import { TeamFlag } from '../ui/TeamFlag'
import { SkeletonCard } from '../ui/LoadingSpinner'
import { useData } from '../../hooks/useData'
import type { Scorer } from '../../types'

function ScorerRow({ scorer, rank }: { scorer: Scorer; rank: number }) {
  const rankColors: Record<number, string> = {
    1: 'text-gold-400 bg-gold-400/10 border-gold-400/20',
    2: 'text-slate-300 bg-slate-300/10 border-slate-400/20',
    3: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-navy-800/50 transition-all">
      {/* Rank */}
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0 ${rankColors[rank] ?? 'text-slate-500 bg-transparent border-transparent'}`}>
        {rank}
      </div>

      {/* Team flag */}
      <TeamFlag crest={scorer.team.crest} name={scorer.team.name} size="xs" className="flex-shrink-0" />

      {/* Player name */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-200 font-medium truncate">{scorer.player.name}</div>
        <div className="text-xs text-slate-600 truncate">{scorer.team.shortName}</div>
      </div>

      {/* Goals */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-center">
          <div className="font-display font-bold text-lg text-white">{scorer.goals}</div>
          <div className="text-[10px] text-slate-600 uppercase tracking-wider">gols</div>
        </div>
        {scorer.assists > 0 && (
          <div className="text-center hidden sm:block">
            <div className="font-semibold text-sm text-slate-400">{scorer.assists}</div>
            <div className="text-[10px] text-slate-600 uppercase tracking-wider">assists</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function TopScorersWidget() {
  const { data, loading } = useData()

  if (loading) return <SkeletonCard />

  const topScorers = (data?.scorers ?? []).slice(0, 6)

  return (
    <Card>
      <CardHeader
        title="Artilheiros"
        icon={<Target className="h-4 w-4" />}
        action={
          <NavLink to="/artilheiros" className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors">
            Ver todos <ChevronRight className="h-3 w-3" />
          </NavLink>
        }
      />
      {topScorers.length === 0 ? (
        <div className="text-center py-8 text-slate-600">Nenhum gol marcado ainda</div>
      ) : (
        <div className="divide-y divide-navy-700/50">
          {topScorers.map((scorer, i) => (
            <ScorerRow key={scorer.player.id} scorer={scorer} rank={i + 1} />
          ))}
        </div>
      )}
    </Card>
  )
}
