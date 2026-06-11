import { useState } from 'react'
import { Shield, Search } from 'lucide-react'
import { TeamFlag } from '../components/ui/TeamFlag'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useData } from '../hooks/useData'
import { getGroupLabel, isMatchFinished, getMatchResult, translateTeam } from '../utils/helpers'
import type { Team, Match } from '../types'
import clsx from 'clsx'

function getTeamStats(teamId: number, matches: Match[]) {
  const played = matches.filter(m =>
    isMatchFinished(m.status) &&
    (m.homeTeam.id === teamId || m.awayTeam.id === teamId)
  )
  const wins = played.filter(m => getMatchResult(m, teamId) === 'win').length
  const draws = played.filter(m => getMatchResult(m, teamId) === 'draw').length
  const losses = played.filter(m => getMatchResult(m, teamId) === 'loss').length
  const goalsFor = played.reduce((acc, m) => {
    if (m.homeTeam.id === teamId) return acc + (m.score.fullTime?.home ?? 0)
    return acc + (m.score.fullTime?.away ?? 0)
  }, 0)
  const goalsAgainst = played.reduce((acc, m) => {
    if (m.homeTeam.id === teamId) return acc + (m.score.fullTime?.away ?? 0)
    return acc + (m.score.fullTime?.home ?? 0)
  }, 0)
  return { played: played.length, wins, draws, losses, goalsFor, goalsAgainst }
}

function TeamCard({ team, matches, group }: { team: Team; matches: Match[]; group?: string }) {
  const stats = getTeamStats(team.id, matches)

  return (
    <div className="rounded-xl border border-navy-700/60 bg-navy-800/20 hover:bg-navy-800/40 hover:border-navy-600 transition-all p-4">
      <div className="flex items-center gap-3 mb-4">
        <TeamFlag crest={team.crest} name={team.name} size="xl" />
        <div className="min-w-0">
          <div className="font-display font-bold text-base text-white truncate">{translateTeam(team.name)}</div>
          <div className="text-xs text-slate-500">{team.tla}</div>
          {group && (
            <div className="mt-1 text-[10px] text-gold-400 font-semibold uppercase tracking-wider">
              {getGroupLabel(group)}
            </div>
          )}
        </div>
      </div>

      {stats.played > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-navy-900/50 rounded-lg py-1.5">
            <div className="font-bold text-base text-pitch-500">{stats.wins}</div>
            <div className="text-[10px] text-slate-600 uppercase">V</div>
          </div>
          <div className="bg-navy-900/50 rounded-lg py-1.5">
            <div className="font-bold text-base text-amber-400">{stats.draws}</div>
            <div className="text-[10px] text-slate-600 uppercase">E</div>
          </div>
          <div className="bg-navy-900/50 rounded-lg py-1.5">
            <div className="font-bold text-base text-red-400">{stats.losses}</div>
            <div className="text-[10px] text-slate-600 uppercase">D</div>
          </div>
          <div className="col-span-3 text-xs text-slate-500 mt-1">
            {stats.goalsFor} gols pró · {stats.goalsAgainst} contra
          </div>
        </div>
      )}

      {stats.played === 0 && (
        <div className="text-xs text-slate-700 text-center py-2">Nenhum jogo realizado</div>
      )}
    </div>
  )
}

export function TeamsPage() {
  const { data, loading } = useData()
  const [search, setSearch] = useState('')

  if (loading) return <LoadingSpinner />

  const allTeams = Array.from(
    new Map(
      (data?.matches ?? []).flatMap(m => [
        [m.homeTeam.id, m.homeTeam],
        [m.awayTeam.id, m.awayTeam]
      ])
    ).values()
  ).filter(t => t.id != null && t.name != null && t.name !== 'None' && t.tla !== 'None')

  const teamGroups = (data?.standings ?? []).reduce((acc, s) => {
    s.table.forEach(entry => {
      acc[entry.team.id] = s.group
    })
    return acc
  }, {} as Record<number, string>)

  const filtered = allTeams.filter(t =>
    search === '' ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    translateTeam(t.name).toLowerCase().includes(search.toLowerCase()) ||
    t.tla.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Seleções</h1>
        <p className="text-slate-500 text-sm">{allTeams.length} seleções participantes</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar seleção..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm bg-navy-800 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhuma seleção encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              matches={data?.matches ?? []}
              group={teamGroups[team.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
