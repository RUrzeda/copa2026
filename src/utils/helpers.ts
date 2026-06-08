import { format, parseISO, isPast, isToday, differenceInSeconds } from 'date-fns'

// ─── Traduções de nomes de seleções (API retorna em inglês) ───────────────────
const TEAM_NAMES_PT: Record<string, string> = {
  // América do Sul
  'Brazil': 'Brasil',
  'Argentina': 'Argentina',
  'Colombia': 'Colômbia',
  'Ecuador': 'Equador',
  'Uruguay': 'Uruguai',
  'Venezuela': 'Venezuela',
  'Chile': 'Chile',
  'Paraguay': 'Paraguai',
  'Bolivia': 'Bolívia',
  'Peru': 'Peru',
  // América do Norte / Central / Caribe
  'United States': 'Estados Unidos',
  'Mexico': 'México',
  'Canada': 'Canadá',
  'Panama': 'Panamá',
  'Costa Rica': 'Costa Rica',
  'Trinidad and Tobago': 'Trinidad e Tobago',
  'Jamaica': 'Jamaica',
  'Honduras': 'Honduras',
  'El Salvador': 'El Salvador',
  'Guatemala': 'Guatemala',
  'Haiti': 'Haiti',
  'Curaçao': 'Curaçao',
  // Europa
  'Germany': 'Alemanha',
  'France': 'França',
  'Spain': 'Espanha',
  'England': 'Inglaterra',
  'Portugal': 'Portugal',
  'Netherlands': 'Holanda',
  'Italy': 'Itália',
  'Belgium': 'Bélgica',
  'Croatia': 'Croácia',
  'Serbia': 'Sérvia',
  'Switzerland': 'Suíça',
  'Austria': 'Áustria',
  'Scotland': 'Escócia',
  'Ukraine': 'Ucrânia',
  'Slovakia': 'Eslováquia',
  'Poland': 'Polônia',
  'Czech Republic': 'República Tcheca',
  'Czechia': 'República Tcheca',
  'Denmark': 'Dinamarca',
  'Sweden': 'Suécia',
  'Norway': 'Noruega',
  'Finland': 'Finlândia',
  'Romania': 'Romênia',
  'Slovenia': 'Eslovênia',
  'Turkey': 'Turquia',
  'Greece': 'Grécia',
  'Albania': 'Albânia',
  'North Macedonia': 'Macedônia do Norte',
  'Georgia': 'Geórgia',
  'Iceland': 'Islândia',
  'Hungary': 'Hungria',
  'Montenegro': 'Montenegro',
  'Bosnia and Herzegovina': 'Bósnia e Herzegovina',
  'Wales': 'País de Gales',
  'Republic of Ireland': 'Irlanda',
  'Ireland': 'Irlanda',
  'Northern Ireland': 'Irlanda do Norte',
  'Kosovo': 'Kosovo',
  'Azerbaijan': 'Azerbaijão',
  'Belarus': 'Bielorrússia',
  'Estonia': 'Estônia',
  'Latvia': 'Letônia',
  'Lithuania': 'Lituânia',
  'Luxembourg': 'Luxemburgo',
  'Moldova': 'Moldávia',
  'Bulgaria': 'Bulgária',
  'Cyprus': 'Chipre',
  'Malta': 'Malta',
  'Armenia': 'Armênia',
  // Ásia
  'Japan': 'Japão',
  'South Korea': 'Coreia do Sul',
  'Korea Republic': 'Coreia do Sul',
  'Saudi Arabia': 'Arábia Saudita',
  'Iran': 'Irã',
  'Australia': 'Austrália',
  'Qatar': 'Catar',
  'Jordan': 'Jordânia',
  'Iraq': 'Iraque',
  'Uzbekistan': 'Uzbequistão',
  'Indonesia': 'Indonésia',
  'China PR': 'China',
  'China': 'China',
  'United Arab Emirates': 'Emirados Árabes',
  'UAE': 'Emirados Árabes',
  'Bahrain': 'Bahrein',
  'Oman': 'Omã',
  'Kuwait': 'Kuwait',
  'India': 'Índia',
  'Thailand': 'Tailândia',
  'Vietnam': 'Vietnã',
  'Philippines': 'Filipinas',
  'Malaysia': 'Malásia',
  'Singapore': 'Singapura',
  'Kyrgyzstan': 'Quirguistão',
  'Tajikistan': 'Tadjiquistão',
  'Palestine': 'Palestina',
  'Syria': 'Síria',
  'Lebanon': 'Líbano',
  'Myanmar': 'Mianmar',
  // África
  'Morocco': 'Marrocos',
  'Senegal': 'Senegal',
  'Nigeria': 'Nigéria',
  'Cameroon': 'Camarões',
  'Ghana': 'Gana',
  'Egypt': 'Egito',
  'Tunisia': 'Tunísia',
  'Mali': 'Mali',
  'South Africa': 'África do Sul',
  'Algeria': 'Argélia',
  "Côte d'Ivoire": 'Costa do Marfim',
  'Ivory Coast': 'Costa do Marfim',
  'DR Congo': 'RD Congo',
  'Congo DR': 'RD Congo',
  "Congo, The Democratic Republic of the": 'RD Congo',
  'Zambia': 'Zâmbia',
  'Tanzania': 'Tanzânia',
  'Uganda': 'Uganda',
  'Zimbabwe': 'Zimbábue',
  'Equatorial Guinea': 'Guiné Equatorial',
  'Guinea': 'Guiné',
  'Gabon': 'Gabão',
  'Kenya': 'Quênia',
  'Mozambique': 'Moçambique',
  'Ethiopia': 'Etiópia',
  'Libya': 'Líbia',
  'Sudan': 'Sudão',
  'Rwanda': 'Ruanda',
  'Mauritania': 'Mauritânia',
  'Namibia': 'Namíbia',
  'Comoros': 'Comores',
  'Cape Verde': 'Cabo Verde',
  'Gambia': 'Gâmbia',
  'Burkina Faso': 'Burkina Faso',
  'Benin': 'Benin',
  'Angola': 'Angola',
  'Madagascar': 'Madagascar',
  'Togo': 'Togo',
  'Liberia': 'Libéria',
  "Guinea-Bissau": 'Guiné-Bissau',
  'Sierra Leone': 'Serra Leoa',
  'Mauritius': 'Maurícia',
  // Oceania
  'New Zealand': 'Nova Zelândia',
  'Fiji': 'Fiji',
  'Papua New Guinea': 'Papua-Nova Guiné',
}

export function translateTeam(name: string | undefined | null): string {
  if (!name) return ''
  return TEAM_NAMES_PT[name] ?? name
}

export function translateNationality(nationality: string | undefined | null): string {
  if (!nationality) return ''
  return TEAM_NAMES_PT[nationality] ?? nationality
}
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
    GROUP_STAGE:    'Fase de Grupos',
    LAST_32:        'Rodada de 32',
    LAST_16:        'Oitavas de Final',
    ROUND_OF_32:    'Rodada de 32',
    ROUND_OF_16:    'Oitavas de Final',
    QUARTER_FINALS: 'Quartas de Final',
    SEMI_FINALS:    'Semifinais',
    THIRD_PLACE:    '3º Lugar',
    FINAL:          'Final',
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
    // Use local date so a match at 22:00 local time isn't grouped under the next UTC day
    const localDate = format(parseISO(match.utcDate), 'yyyy-MM-dd')
    if (!acc[localDate]) acc[localDate] = []
    acc[localDate].push(match)
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
