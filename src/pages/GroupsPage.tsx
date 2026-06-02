import { Users } from 'lucide-react'
import { AdLeaderboard } from '../components/ui/AdBanner'
import { Card } from '../components/ui/Card'
import { TeamFlag } from '../components/ui/TeamFlag'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useData } from '../hooks/useData'
import { getGroupLabel, getPositionStyle, getFormColor } from '../utils/helpers'
import type { StandingEntry, GroupStanding } from '../types'
import clsx from 'clsx'

const COL_HEADERS = [
  { key: 'pos', label: '#', title: 'Posição' },
  { key: 'team', label: 'Seleção', title: '' },
  { key: 'pg', label: 'PJ', title: 'Jogos' },
  { key: 'w', label: 'V', title: 'Vitórias' },
  { key: 'e', label: 'E', title: 'Empates' },
  { key: 'l', label: 'D', title: 'Derrotas' },
  { key: 'gf', label: 'GP', title: 'Gols Pró' },
  { key: 'gc', label: 'GC', title: 'Gols Contra' },
  { key: 'sg', label: 'SG', title: 'Saldo de Gols' },
  { key: 'pts', label: 'PTS', title: 'Pontos' },
  { key: 'form', label: 'Forma', title: 'Últimos 5 jogos' },
]

function GroupRow({ entry, index }: { entry: StandingEntry; index: number }) {
  const advances = index < 2
  const mayAdvance = index === 2
  const formChars = (entry.form ?? '').split('').slice(-5)

  return (
    <tr className={clsx(
      'border-b border-navy-700/50 transition-colors hover:bg-navy-800/30',
      advances && 'bg-pitch-500/5',
    )}>
      <td className="py-3 pl-4 pr-2 w-8">
        <div className="flex items-center gap-1.5">
          {(advances || mayAdvance) && (
            <span className={clsx('w-0.5 h-5 rounded-full flex-shrink-0', advances ? 'bg-pitch-500' : 'bg-amber-400')} />
          )}
          <span className={clsx('text-sm font-semibold', getPositionStyle(entry.position, 4))}>
            {entry.position}
          </span>
        </div>
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <TeamFlag crest={entry.team.crest} name={entry.team.name} size="sm" />
          <div>
            <span className="text-sm text-slate-100 font-medium block">{entry.team.shortName}</span>
            <span className="text-xs text-slate-600 hidden md:block">{entry.team.tla}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-center text-sm text-slate-400">{entry.playedGames}</td>
      <td className="hidden sm:table-cell py-3 px-3 text-center text-sm text-slate-300">{entry.won}</td>
      <td className="hidden sm:table-cell py-3 px-3 text-center text-sm text-slate-300">{entry.draw}</td>
      <td className="hidden sm:table-cell py-3 px-3 text-center text-sm text-slate-300">{entry.lost}</td>
      <td className="hidden sm:table-cell py-3 px-3 text-center text-sm text-slate-400">{entry.goalsFor}</td>
      <td className="hidden sm:table-cell py-3 px-3 text-center text-sm text-slate-400">{entry.goalsAgainst}</td>
      <td className={clsx(
        'py-3 px-3 text-center text-sm font-semibold',
        entry.goalDifference > 0 ? 'text-pitch-500' :
        entry.goalDifference < 0 ? 'text-red-400' : 'text-slate-400'
      )}>
        {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
      </td>
      <td className="py-3 px-4 text-center">
        <span className="font-display font-bold text-base text-white">{entry.points}</span>
      </td>
      <td className="hidden md:table-cell py-3 px-4">
        <div className="flex items-center gap-1 justify-center">
          {formChars.length === 0 ? (
            <span className="text-xs text-slate-700">—</span>
          ) : (
            formChars.map((result, i) => (
              <span
                key={i}
                title={result === 'W' ? 'Vitória' : result === 'D' ? 'Empate' : 'Derrota'}
                className={clsx('w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-bold', getFormColor(result))}
              >
                {result}
              </span>
            ))
          )}
        </div>
      </td>
    </tr>
  )
}

function GroupCard({ group }: { group: GroupStanding }) {
  return (
    <Card className="overflow-hidden !p-0">
      <div className="px-4 py-3 border-b border-navy-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gold-500" />
          <h2 className="font-display font-bold text-gold-400 text-sm uppercase tracking-wider">
            {getGroupLabel(group.group)}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-600 uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pitch-500" />
            Classificado
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Possível 3º
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700/50">
              {COL_HEADERS.map(h => (
                <th
                  key={h.key}
                  title={h.title}
                  className={clsx(
                    'py-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider',
                    h.key === 'team' ? 'text-left pl-2' : 'text-center px-3',
                    h.key === 'form' ? 'hidden md:table-cell' : '',
                    ['w', 'e', 'l', 'gf', 'gc'].includes(h.key) ? 'hidden sm:table-cell' : ''
                  )}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.table.map((entry, i) => (
              <GroupRow key={entry.team.id} entry={entry} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function GroupsPage() {
  const { data, loading } = useData()

  if (loading) return <LoadingSpinner />

  const standings = data?.standings ?? []

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Fase de Grupos</h1>
        <p className="text-slate-500 text-sm">
          {standings.length} grupos · Top 2 de cada grupo + 8 melhores 3ºs avançam para as oitavas
        </p>
      </div>

      <AdLeaderboard slot="1122334455" className="mb-2" />

      {standings.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Grupos serão exibidos quando a Copa começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {standings.map(group => (
            <GroupCard key={group.group} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}
