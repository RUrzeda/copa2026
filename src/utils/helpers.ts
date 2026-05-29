import { format, parseISO, isPast, isToday, differenceInSeconds } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { MatchStatus, MatchStage, Match } from '../types'

export function formatMatchDate(utcDate: string): string {
  try {
    return format(parseISO(utcDate), "d 'de' MMMM", { locale: ptBR })
  } catch {
    return utcDate
  }
}

export function formatMatchTime(utcDate: string): string {
  try {
    return format(parseISO(utcDate), 'HH:mm', { locale: ptBR })
  } catch {
    return '--:--'
  }
}

export function formatFullDate(utcDate: string): string {
  try {
    return format(parseISO(utcDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return utcDate
  }
}

export function isMatchLive(status: MatchStatus): boolean {
  return status === 'IN_PLAY' || status === 'PAUSED'
}

export function isMatchFinished(status: MatchStatus): boolean {
  return status === 'FINISHED'
}

export function isMatchScheduled(status: MatchStatus): boolean {
  return status === 'SCHEDULED' || status === 'TIMED'
}

export function getStatusLabel(status: MatchStatus): string {
  const labels: Record<MatchStatus, string> = {
    SCHEDULED: 'Agendado',
    TIMED: 'Agendado',
    IN_PLAY: 'Ao Vivo',
    PAUSED: 'Intervalo',
    FINISHED: 'Encerrado',
    POSTPONED: 'Adiado',
    SUSPENDED: 'Suspenso',
    CANCELLED: 'Cancelado',
  }
  return labels[status] ?? status
}

export function getStageLabel(stage: MatchStage | string): string {
  const labels: Record<string, string> = {
    GROUP_STAGE: 'Fase de Grupos',
    ROUND_OF_32: 'Oitavas de Final',
    ROUND_OF_16: 'Oitavas de Final',
    QUARTER_FINALS: 'Quartas de Final',
    SEMI_FINALS: 'Semifinais',
    THIRD_PLACE: '3º Lugar',
    FINAL: 'Final',
  }
  return labels[stage] ?? stage
}

export function getGroupLabel(group: string | null): string {
  if (!group) return ''
  return group.replace('GROUP_', 'Grupo ')
}

export function formatScore(match: Match): string {
  const { fullTime } = match.score
  if (fullTime.home === null || fullTime.away === null) return '-'
  return `${fullTime.home} - ${fullTime.away}`
}

export function getMatchResult(match: Match, teamId: number): 'win' | 'loss' | 'draw' | null {
  if (!isMatchFinished(match.status)) return null
  const { winner } = match.score
  if (winner === 'DRAW') return 'draw'
  if (winner === 'HOME_TEAM' && match.homeTeam.id === teamId) return 'win'
  if (winner === 'AWAY_TEAM' && match.awayTeam.id === teamId) return 'win'
  return 'loss'
}

export function getFormColor(result: string): string {
  switch (result) {
    case 'W': return 'bg-pitch-500'
    case 'D': return 'bg-amber-500'
    case 'L': return 'bg-red-500'
    default: return 'bg-navy-600'
  }
}

export function getCountdownToWorldCup(): { days: number; hours: number; minutes: number; seconds: number; started: boolean } {
  const wcStart = new Date('2026-06-11T20:00:00Z')
  const now = new Date()
  const diff = differenceInSeconds(wcStart, now)

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true }
  }

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60

  return { days, hours, minutes, seconds, started: false }
}

export function groupMatchesByDate(matches: Match[]): Record<string, Match[]> {
  return matches.reduce((acc, match) => {
    const date = match.utcDate.split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(match)
    return acc
  }, {} as Record<string, Match[]>)
}

export function getLiveMatches(matches: Match[]): Match[] {
  return matches.filter(m => isMatchLive(m.status))
}

export function getUpcomingMatches(matches: Match[], limit = 5): Match[] {
  return matches
    .filter(m => isMatchScheduled(m.status))
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
    .slice(0, limit)
}

export function getRecentMatches(matches: Match[], limit = 5): Match[] {
  return matches
    .filter(m => isMatchFinished(m.status))
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, limit)
}

export function getPositionStyle(position: number, totalInGroup: number): string {
  if (position <= 2) return 'text-pitch-500 font-semibold'
  if (position === 3) return 'text-amber-400'
  return 'text-slate-400'
}
