import { useState, useMemo } from 'react'
import { Calendar, Filter } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TeamFlag } from '../components/ui/TeamFlag'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useData } from '../hooks/useData'
import {
  formatFullDate, formatMatchDate, formatMatchTime,
  getStatusLabel, isMatchLive, isMatchFinished,
  formatScore, getStageLabel, getGroupLabel, groupMatchesByDate, translateTeam
} from '../utils/helpers'
import { ShareMatch } from '../components/ui/ShareButton'
import type { Match, MatchStage } from '../types'
import clsx from 'clsx'

const STAGES: { value: string; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'GROUP_STAGE', label: 'Grupos' },
  { value: 'ROUND_OF_32', label: 'Oitavas' },
  { value: 'QUARTER_FINALS', label: 'Quartas' },
  { value: 'SEMI_FINALS', label: 'Semifinais' },
  { value: 'FINAL', label: 'Final' },
]

function MatchCard({ match }: { match: Match }) {
  const live = isMatchLive(match.status)
  const finished = isMatchFinished(match.status)
  const homeWon = match.score.winner === 'HOME_TEAM'
  const awayWon = match.score.winner === 'AWAY_TEAM'

  return (
    <div className={clsx(
      'group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all',
      live
        ? 'border-red-500/20 bg-red-500/5 shadow-lg shadow-red-500/5'
        : 'border-navy-700/50 bg-navy-800/20 hover:bg-navy-800/40'
    )}>
      {/* Status */}
      <div className="w-14 sm:w-20 text-center flex-shrink-0">
        {live ? (
          <Badge label="Ao Vivo" variant="live" pulse />
        ) : finished ? (
          <Badge label="Enc." variant="finished" />
        ) : (
          <div className="font-mono font-bold text-slate-300 text-sm sm:text-lg">{formatMatchTime(match.utcDate)}</div>
        )}
        {match.group && (
          <div className="text-[10px] text-slate-600 mt-1">{getGroupLabel(match.group)}</div>
        )}
      </div>

      {/* Home */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0 justify-end">
        <span className={clsx('font-semibold text-xs sm:text-base truncate text-right', homeWon ? 'text-white' : finished ? 'text-slate-500' : 'text-slate-200')}>
          <span className="hidden sm:inline">{translateTeam(match.homeTeam.shortName)}</span>
          <span className="sm:hidden">{match.homeTeam.tla || translateTeam(match.homeTeam.shortName)}</span>
        </span>
        <TeamFlag crest={match.homeTeam.crest} name={match.homeTeam.name} size="sm" className="flex-shrink-0" />
      </div>

      {/* Score */}
      <div className="flex-shrink-0 w-14 sm:w-20 text-center">
        {finished || live ? (
          <div className={clsx(
            'font-display font-bold text-base sm:text-2xl rounded-xl px-1.5 sm:px-2 py-1',
            live ? 'text-red-300 bg-red-500/10' : 'text-white bg-navy-700'
          )}>
            {formatScore(match)}
          </div>
        ) : (
          <div className="font-bold text-slate-600 text-base sm:text-xl">vs</div>
        )}
        {match.score.duration !== 'REGULAR' && finished && (
          <div className="text-[10px] text-slate-600 mt-0.5">
            {match.score.duration === 'EXTRA_TIME' ? 'Prorr.' : 'Pên.'}
          </div>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
        <TeamFlag crest={match.awayTeam.crest} name={match.awayTeam.name} size="sm" className="flex-shrink-0" />
        <span className={clsx('font-semibold text-xs sm:text-base truncate', awayWon ? 'text-white' : finished ? 'text-slate-500' : 'text-slate-200')}>
          <span className="hidden sm:inline">{translateTeam(match.awayTeam.shortName)}</span>
          <span className="sm:hidden">{match.awayTeam.tla || translateTeam(match.awayTeam.shortName)}</span>
        </span>
      </div>

      {/* Stage + Share */}
      <div className="hidden lg:flex flex-col items-end gap-1 w-28 flex-shrink-0">
        <div className="text-xs text-slate-600">{getStageLabel(match.stage)}</div>
        {match.venue && <div className="text-[10px] text-slate-700 truncate max-w-full">{match.venue}</div>}
        {(finished || live) && <ShareMatch match={match} />}
      </div>
      {/* Share — mobile (sempre visível) */}
      {(finished || live) && (
        <div className="lg:hidden flex-shrink-0">
          <ShareMatch match={match} />
        </div>
      )}
    </div>
  )
}

export function MatchesPage() {
  const { data, loading } = useData()
  const [stageFilter, setStageFilter] = useState('all')
  const [showOnlyLive, setShowOnlyLive] = useState(false)

  const filtered = useMemo(() => {
    if (!data) return []
    let list = data.matches
    if (showOnlyLive) list = list.filter(m => isMatchLive(m.status))
    if (stageFilter !== 'all') list = list.filter(m => m.stage === stageFilter)
    return list.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
  }, [data, stageFilter, showOnlyLive])

  const grouped = useMemo(() => groupMatchesByDate(filtered), [filtered])
  const sortedDates = Object.keys(grouped).sort()
  const liveCount = data?.matches.filter(m => isMatchLive(m.status)).length ?? 0

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Jogos</h1>
        <p className="text-slate-500 text-sm">{data?.matches.length ?? 0} jogos no total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-navy-800/40 rounded-xl border border-navy-700">
        <Filter className="h-4 w-4 text-slate-500" />

        {liveCount > 0 && (
          <button
            onClick={() => setShowOnlyLive(!showOnlyLive)}
            className={clsx(
              'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
              showOnlyLive
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'text-slate-400 border-navy-600 hover:border-red-500/30 hover:text-red-400'
            )}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            Ao Vivo ({liveCount})
          </button>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {STAGES.map(s => (
            <button
              key={s.value}
              onClick={() => { setStageFilter(s.value); setShowOnlyLive(false) }}
              className={clsx(
                'text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                stageFilter === s.value
                  ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                  : 'text-slate-400 border-navy-600 hover:border-gold-500/20 hover:text-slate-200'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matches by date */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum jogo encontrado</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold text-slate-400 capitalize">
                  {formatFullDate(`${date}T00:00:00`)}
                </h2>
                <div className="flex-1 h-px bg-navy-700" />
                <span className="text-xs text-slate-600">{grouped[date].length} jogos</span>
              </div>
              <div className="space-y-2">
                {grouped[date].map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
