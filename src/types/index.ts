export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'SUSPENDED'
  | 'CANCELLED'

export type MatchStage =
  | 'GROUP_STAGE'
  | 'ROUND_OF_32'
  | 'ROUND_OF_16'
  | 'QUARTER_FINALS'
  | 'SEMI_FINALS'
  | 'THIRD_PLACE'
  | 'FINAL'

export interface Team {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  flag?: string
  group?: string
}

export interface Score {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT'
  fullTime: { home: number | null; away: number | null }
  halfTime: { home: number | null; away: number | null }
  regularTime?: { home: number | null; away: number | null }
  extraTime?: { home: number | null; away: number | null }
  penalties?: { home: number | null; away: number | null }
}

export interface Match {
  id: number
  utcDate: string
  status: MatchStatus
  matchday: number
  stage: MatchStage
  group: string | null
  lastUpdated: string
  homeTeam: Team
  awayTeam: Team
  score: Score
  venue?: string
  referees?: Array<{ id: number; name: string; nationality: string }>
}

export interface StandingEntry {
  position: number
  team: Team
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  form: string
}

export interface GroupStanding {
  stage: string
  type: string
  group: string
  table: StandingEntry[]
}

export interface Scorer {
  player: {
    id: number
    name: string
    firstName: string
    lastName: string
    dateOfBirth: string
    nationality: string
    position: string
    shirtNumber: number | null
  }
  team: Team
  goals: number
  assists: number
  penalties: number
}

export interface Competition {
  id: number
  name: string
  code: string
  type: string
  emblem: string
  currentSeason: {
    id: number
    startDate: string
    endDate: string
    currentMatchday: number
  }
  lastUpdated: string
}

export interface ApiData {
  competition: Competition | null
  standings: GroupStanding[]
  matches: Match[]
  scorers: Scorer[]
  lastFetch: string
}
