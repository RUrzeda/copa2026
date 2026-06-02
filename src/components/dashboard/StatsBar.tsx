import { useData } from '../../hooks/useData'
import { isMatchFinished, isMatchLive } from '../../utils/helpers'
import { Flame, Swords, Users, Trophy } from 'lucide-react'

interface StatItemProps {
  icon: React.ReactNode
  value: string | number
  label: string
  highlight?: boolean
}

function StatItem({ icon, value, label, highlight = false }: StatItemProps) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border ${highlight ? 'border-gold-500/20 bg-gold-500/5' : 'border-navy-700 bg-navy-800/40'}`}>
      <div className={`flex-shrink-0 ${highlight ? 'text-gold-400' : 'text-slate-500'}`}>{icon}</div>
      <div className="min-w-0">
        <div className={`font-display font-bold text-base sm:text-xl truncate ${highlight ? 'text-gold-400' : 'text-white'}`}>
          {value}
        </div>
        <div className="text-[10px] sm:text-xs text-slate-600">{label}</div>
      </div>
    </div>
  )
}

export function StatsBar() {
  const { data } = useData()

  if (!data) return null

  const finishedMatches = data.matches.filter(m => isMatchFinished(m.status))
  const liveCount = data.matches.filter(m => isMatchLive(m.status)).length
  const totalGoals = finishedMatches.reduce((acc, m) => {
    return acc + (m.score.fullTime.home ?? 0) + (m.score.fullTime.away ?? 0)
  }, 0)
  const avgGoals = finishedMatches.length > 0
    ? (totalGoals / finishedMatches.length).toFixed(1)
    : '0.0'
  const topGoals = data.scorers[0]?.goals ?? 0
  const topName = data.scorers[0]?.player.name?.split(' ').pop() ?? '—'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <StatItem
        icon={<Swords className="h-5 w-5" />}
        value={finishedMatches.length}
        label="Jogos realizados"
        highlight={liveCount > 0}
      />
      <StatItem
        icon={<Flame className="h-5 w-5" />}
        value={totalGoals}
        label="Gols marcados"
      />
      <StatItem
        icon={<Trophy className="h-5 w-5" />}
        value={`${topGoals} — ${topName}`}
        label="Artilheiro"
      />
      <StatItem
        icon={<Users className="h-5 w-5" />}
        value="48"
        label="Seleções"
      />
    </div>
  )
}
