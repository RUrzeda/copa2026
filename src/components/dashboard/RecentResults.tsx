import { CheckCircle, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card, CardHeader } from '../ui/Card'
import { TeamFlag } from '../ui/TeamFlag'
import { SkeletonCard } from '../ui/LoadingSpinner'
import { useData } from '../../hooks/useData'
import { getRecentMatches, formatMatchDate, formatScore, getStageLabel, translateTeam } from '../../utils/helpers'
import type { Match } from '../../types'

function ResultRow({ match }: { match: Match }) {
  const homeWon = match.score.winner === 'HOME_TEAM'
  const awayWon = match.score.winner === 'AWAY_TEAM'
  const draw = match.score.winner === 'DRAW'

  return (
    <div className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-navy-800/50 transition-all">
      {/* Date */}
      <div className="w-16 text-center flex-shrink-0">
        <span className="text-xs text-slate-500">{formatMatchDate(match.utcDate)}</span>
      </div>

      {/* Home */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className={`text-sm font-semibold truncate text-right ${homeWon ? 'text-white' : 'text-slate-500'}`}>
          {translateTeam(match.homeTeam.shortName)}
        </span>
        <div className="relative flex-shrink-0">
          <TeamFlag crest={match.homeTeam.crest} name={match.homeTeam.name} size="sm" />
          {homeWon && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-pitch-500 rounded-full border border-navy-800" />
          )}
        </div>
      </div>

      {/* Score */}
      <div className="w-16 text-center flex-shrink-0 bg-navy-800 rounded-lg px-2 py-1">
        <span className="font-display font-bold text-white text-sm">{formatScore(match)}</span>
      </div>

      {/* Away */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <TeamFlag crest={match.awayTeam.crest} name={match.awayTeam.name} size="sm" />
          {awayWon && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-pitch-500 rounded-full border border-navy-800" />
          )}
        </div>
        <span className={`text-sm font-semibold truncate ${awayWon ? 'text-white' : 'text-slate-500'}`}>
          {translateTeam(match.awayTeam.shortName)}
        </span>
      </div>

      {/* Stage */}
      <div className="hidden md:block w-20 text-right flex-shrink-0">
        <span className="text-xs text-slate-600">{getStageLabel(match.stage)}</span>
      </div>
    </div>
  )
}

export function RecentResults() {
  const { data, loading } = useData()

  if (loading) return <SkeletonCard />

  const recent = data ? getRecentMatches(data.matches, 5) : []

  return (
    <Card>
      <CardHeader
        title="Resultados Recentes"
        icon={<CheckCircle className="h-4 w-4" />}
        action={
          <NavLink to="/jogos" className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors">
            Ver todos <ChevronRight className="h-3 w-3" />
          </NavLink>
        }
      />
      {recent.length === 0 ? (
        <div className="text-center py-8 text-slate-600">Nenhum resultado ainda</div>
      ) : (
        <div className="divide-y divide-navy-700/50">
          {recent.map(match => (
            <ResultRow key={match.id} match={match} />
          ))}
        </div>
      )}
    </Card>
  )
}
