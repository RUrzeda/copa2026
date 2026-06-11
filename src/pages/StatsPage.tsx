import { BarChart2, TrendingUp, Swords, Target, AlertTriangle } from 'lucide-react'
import { Card, CardHeader } from '../components/ui/Card'
import { TeamFlag } from '../components/ui/TeamFlag'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useData } from '../hooks/useData'
import { isMatchFinished, getGroupLabel, translateTeam } from '../utils/helpers'

interface StatBarProps {
  label: string
  value: number
  max: number
  color?: string
  suffix?: string
}

function StatBar({ label, value, max, color = 'bg-gold-500', suffix = '' }: StatBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs text-slate-400 w-24 text-right flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-white w-8 flex-shrink-0">{value}{suffix}</span>
    </div>
  )
}

export function StatsPage() {
  const { data, loading } = useData()

  if (loading) return <LoadingSpinner />

  const matches = data?.matches ?? []
  const finished = matches.filter(m => isMatchFinished(m.status))

  // Goals per match
  const totalGoals = finished.reduce((acc, m) =>
    acc + (m.score.fullTime?.home ?? 0) + (m.score.fullTime?.away ?? 0), 0)
  const avgGoals = finished.length > 0 ? (totalGoals / finished.length).toFixed(2) : '0.00'

  // Results breakdown
  const homeWins = finished.filter(m => m.score.winner === 'HOME_TEAM').length
  const awayWins = finished.filter(m => m.score.winner === 'AWAY_TEAM').length
  const draws = finished.filter(m => m.score.winner === 'DRAW').length

  // Goals by group
  const goalsByGroup = (data?.standings ?? []).reduce((acc, group) => {
    const groupMatches = finished.filter(m => m.group === group.group)
    const goals = groupMatches.reduce((g, m) =>
      g + (m.score.fullTime?.home ?? 0) + (m.score.fullTime?.away ?? 0), 0)
    acc[group.group] = goals
    return acc
  }, {} as Record<string, number>)

  const maxGroupGoals = Math.max(...Object.values(goalsByGroup), 1)

  // Top scoring teams
  const teamGoals: Record<number, { name: string; crest: string; goals: number }> = {}
  finished.forEach(m => {
    const hg = m.score.fullTime?.home ?? 0
    const ag = m.score.fullTime?.away ?? 0
    if (!teamGoals[m.homeTeam.id]) teamGoals[m.homeTeam.id] = { name: m.homeTeam.shortName, crest: m.homeTeam.crest, goals: 0 }
    if (!teamGoals[m.awayTeam.id]) teamGoals[m.awayTeam.id] = { name: m.awayTeam.shortName, crest: m.awayTeam.crest, goals: 0 }
    teamGoals[m.homeTeam.id].goals += hg
    teamGoals[m.awayTeam.id].goals += ag
  })
  const topScoringTeams = Object.values(teamGoals)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 8)
  const maxTeamGoals = topScoringTeams[0]?.goals ?? 1

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Estatísticas</h1>
        <p className="text-slate-500 text-sm">Baseado em {finished.length} jogos realizados</p>
      </div>

      {finished.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Estatísticas disponíveis após o início da Copa</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Swords, label: 'Jogos realizados', value: finished.length, color: 'text-gold-400' },
              { icon: Target, label: 'Total de gols', value: totalGoals, color: 'text-pitch-500' },
              { icon: TrendingUp, label: 'Média gols/jogo', value: avgGoals, color: 'text-blue-400' },
              { icon: AlertTriangle, label: 'Jogos sem gols', value: finished.filter(m => (m.score.fullTime?.home ?? 0) + (m.score.fullTime?.away ?? 0) === 0).length, color: 'text-slate-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card key={label}>
                <div className={`mb-2 ${color}`}><Icon className="h-5 w-5" /></div>
                <div className={`font-display font-bold text-3xl ${color}`}>{value}</div>
                <div className="text-xs text-slate-600 mt-1">{label}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Results breakdown */}
            <Card>
              <CardHeader title="Resultados" icon={<Swords className="h-4 w-4" />} />
              <div className="space-y-1">
                <StatBar label="Mandante" value={homeWins} max={finished.length} color="bg-pitch-500" />
                <StatBar label="Visitante" value={awayWins} max={finished.length} color="bg-blue-500" />
                <StatBar label="Empates" value={draws} max={finished.length} color="bg-amber-500" />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pitch-500" />{homeWins} vitórias do mandante</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />{awayWins} vitórias do visitante</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />{draws} empates</div>
              </div>
            </Card>

            {/* Goals by group */}
            {Object.keys(goalsByGroup).length > 0 && (
              <Card>
                <CardHeader title="Gols por Grupo" icon={<Target className="h-4 w-4" />} />
                <div className="space-y-1">
                  {Object.entries(goalsByGroup)
                    .sort(([, a], [, b]) => b - a)
                    .map(([group, goals]) => (
                      <StatBar
                        key={group}
                        label={getGroupLabel(group)}
                        value={goals}
                        max={maxGroupGoals}
                        color="bg-gold-gradient"
                        suffix=" gols"
                      />
                    ))}
                </div>
              </Card>
            )}

            {/* Top scoring teams */}
            {topScoringTeams.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader title="Seleções com mais gols" icon={<BarChart2 className="h-4 w-4" />} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {topScoringTeams.map((team, i) => (
                    <div key={team.name} className="flex items-center gap-3 py-2">
                      <span className="text-xs text-slate-600 w-4 text-right">{i + 1}</span>
                      <TeamFlag crest={team.crest} name={team.name} size="xs" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300 truncate">{translateTeam(team.name)}</span>
                          <span className="text-xs font-bold text-white ml-2">{team.goals}</span>
                        </div>
                        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-gradient rounded-full"
                            style={{ width: `${(team.goals / maxTeamGoals) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
