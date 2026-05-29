import { Users, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card, CardHeader } from '../ui/Card'
import { TeamFlag } from '../ui/TeamFlag'
import { SkeletonCard } from '../ui/LoadingSpinner'
import { useData } from '../../hooks/useData'
import { getGroupLabel, getPositionStyle } from '../../utils/helpers'
import type { GroupStanding } from '../../types'

function MiniGroupTable({ group }: { group: GroupStanding }) {
  return (
    <div className="bg-navy-900/50 rounded-xl border border-navy-700/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
          {getGroupLabel(group.group)}
        </span>
        <span className="text-[10px] text-slate-600 uppercase">PTS</span>
      </div>

      <div className="space-y-1">
        {group.table.slice(0, 4).map((entry) => (
          <div
            key={entry.team.id}
            className="flex items-center gap-2 py-1 rounded-lg"
          >
            <span className={`text-[11px] w-3 text-center flex-shrink-0 ${getPositionStyle(entry.position, group.table.length)}`}>
              {entry.position}
            </span>
            <TeamFlag crest={entry.team.crest} name={entry.team.name} size="xs" className="flex-shrink-0" />
            <span className="text-xs text-slate-300 flex-1 truncate">{entry.team.tla}</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-shrink-0">
              <span>{entry.playedGames}</span>
              <span className="font-bold text-white">{entry.points}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend for qualification */}
      <div className="mt-2 pt-2 border-t border-navy-700/50 flex items-center gap-3 text-[10px] text-slate-600">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-pitch-500" />
          Classifica
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Possível 3º
        </div>
      </div>
    </div>
  )
}

export function GroupsOverview() {
  const { data, loading } = useData()

  if (loading) return <SkeletonCard />

  const standings = data?.standings ?? []
  const preview = standings.slice(0, 4)

  return (
    <Card>
      <CardHeader
        title="Fase de Grupos"
        subtitle={`${standings.length} grupos`}
        icon={<Users className="h-4 w-4" />}
        action={
          <NavLink to="/grupos" className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors">
            Ver todos <ChevronRight className="h-3 w-3" />
          </NavLink>
        }
      />

      {standings.length === 0 ? (
        <div className="text-center py-8 text-slate-600">Grupos não disponíveis ainda</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {preview.map(group => (
            <MiniGroupTable key={group.group} group={group} />
          ))}
        </div>
      )}
    </Card>
  )
}
