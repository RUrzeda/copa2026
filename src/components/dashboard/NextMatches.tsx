import { Calendar, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { TeamFlag } from '../ui/TeamFlag'
import { SkeletonCard } from '../ui/LoadingSpinner'
import { useData } from '../../hooks/useData'
import {
  getLiveMatches, getUpcomingMatches, formatMatchDate, formatMatchTime,
  getStatusLabel, isMatchLive, isMatchFinished, formatScore, getStageLabel
} from '../../utils/helpers'
import type { Match } from '../../types'

function MatchRow({ match }: { match: Match }) {
  const live = isMatchLive(match.status)
  const finished = isMatchFinished(match.status)

  return (
    <div className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-all ${live ? 'bg-red-500/5 border border-red-500/10' : 'hover:bg-navy-800/50'}`}>
      {/* Date/Time */}
      <div className="w-14 text-center flex-shrink-0">
        {live ? (
          <Badge label="Ao Vivo" variant="live" pulse />
        ) : finished ? (
          <div className="text-xs text-slate-500">
            <div>{formatMatchDate(match.utcDate).split(' ')[0]}</div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-mono font-semibold">
            {formatMatchTime(match.utcDate)}
          </div>
        )}
      </div>

      {/* Home Team */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="text-sm text-slate-200 font-medium truncate text-right">
          {match.homeTeam.shortName}
        </span>
        <TeamFlag crest={match.homeTeam.crest} name={match.homeTeam.name} size="sm" />
      </div>

      {/* Score */}
      <div className="w-16 text-center flex-shrink-0">
        {finished || live ? (
          <span className={`font-display font-bold text-base ${live ? 'text-red-400' : 'text-white'}`}>
            {formatScore(match)}
          </span>
        ) : (
          <span className="text-slate-600 font-bold">vs</span>
        )}
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamFlag crest={match.awayTeam.crest} name={match.awayTeam.name} size="sm" />
        <span className="text-sm text-slate-200 font-medium truncate">
          {match.awayTeam.shortName}
        </span>
      </div>

      {/* Stage */}
      <div className="hidden md:block w-20 text-right flex-shrink-0">
        <span className="text-xs text-slate-600 truncate">{getStageLabel(match.stage)}</span>
      </div>
    </div>
  )
}

export function NextMatches() {
  const { data, loading } = useData()

  if (loading) return <SkeletonCard />

  const liveMatches = data ? getLiveMatches(data.matches) : []
  const upcoming = data ? getUpcomingMatches(data.matches, 5) : []
  const displayed = liveMatches.length > 0 ? [...liveMatches, ...upcoming].slice(0, 5) : upcoming

  return (
    <Card>
      <CardHeader
        title={liveMatches.length > 0 ? 'Ao Vivo & Próximos' : 'Próximos Jogos'}
        icon={<Calendar className="h-4 w-4" />}
        action={
          <NavLink to="/jogos" className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors">
            Ver todos <ChevronRight className="h-3 w-3" />
          </NavLink>
        }
      />
      {displayed.length === 0 ? (
        <div className="text-center py-8 text-slate-600">Nenhum jogo agendado</div>
      ) : (
        <div className="divide-y divide-navy-700/50">
          {displayed.map(match => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      )}
    </Card>
  )
}
