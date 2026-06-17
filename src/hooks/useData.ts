import { useState, useEffect } from 'react'
import type { ApiData, Match, GroupStanding, StandingEntry, Team, Scorer } from '../types'

const BASE_PATH = import.meta.env.BASE_URL

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_PATH}${path}?t=${Date.now()}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return res.json()
}

function initEntry(team: Team): StandingEntry {
  return { position: 0, team, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, form: '' }
}

// Computes group standings directly from match results.
// Always consistent with match data — avoids lag from the standings API endpoint.
// apiPositions used as final tiebreaker (FIFA criteria: cards, head-to-head, etc.)
// since the API already computes those correctly.
function computeStandings(matches: Match[], apiPositions: Map<number, number>): GroupStanding[] {
  const groups: Record<string, Record<number, StandingEntry>> = {}

  for (const m of matches) {
    if (m.stage !== 'GROUP_STAGE' || !m.group) continue
    const g = m.group
    if (!groups[g]) groups[g] = {}
    if (!groups[g][m.homeTeam.id]) groups[g][m.homeTeam.id] = initEntry(m.homeTeam)
    if (!groups[g][m.awayTeam.id]) groups[g][m.awayTeam.id] = initEntry(m.awayTeam)

    if (m.status !== 'FINISHED') continue

    const hg = m.score.fullTime?.home ?? 0
    const ag = m.score.fullTime?.away ?? 0
    const w  = m.score.winner

    const home = groups[g][m.homeTeam.id]
    const away = groups[g][m.awayTeam.id]

    home.playedGames++; home.goalsFor += hg; home.goalsAgainst += ag; home.goalDifference += hg - ag
    away.playedGames++; away.goalsFor += ag; away.goalsAgainst += hg; away.goalDifference += ag - hg

    if (w === 'HOME_TEAM')      { home.won++;  home.points += 3; away.lost++ }
    else if (w === 'AWAY_TEAM') { away.won++;  away.points += 3; home.lost++ }
    else                        { home.draw++; home.points++;    away.draw++; away.points++ }
  }

  if (Object.keys(groups).length === 0) return []

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, teams]) => ({
      stage: 'GROUP_STAGE',
      type: 'TOTAL',
      group,
      table: Object.values(teams)
        .sort((a, b) =>
          b.points - a.points ||
          b.goalDifference - a.goalDifference ||
          b.goalsFor - a.goalsFor ||
          (apiPositions.get(a.team.id) ?? 999) - (apiPositions.get(b.team.id) ?? 999)
        )
        .map((e, i) => ({ ...e, position: i + 1 })),
    }))
}

export function useData() {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const load = async () => {
    try {
      const [competition, apiStandings, matches, scorers] = await Promise.all([
        fetchJson<ApiData['competition']>('data/competition.json').catch(() => null),
        fetchJson<GroupStanding[]>('data/standings.json').catch(() => []),
        fetchJson<Match[]>('data/matches.json').catch(() => []),
        fetchJson<Scorer[]>('data/scorers.json').catch(() => []),
      ])

      const meta = await fetchJson<{ lastFetch: string }>('data/meta.json').catch(() => ({
        lastFetch: new Date().toISOString(),
      }))

      // Build API position map for tiebreaker (cards, head-to-head — criteria we can't compute locally).
      const apiPositions = new Map<number, number>()
      for (const group of apiStandings) {
        for (const entry of group.table) {
          apiPositions.set(entry.team.id, entry.position)
        }
      }

      // Prefer computed standings (always in sync with match data).
      // Fall back to API standings only when no group matches are loaded yet.
      const computed = computeStandings(matches, apiPositions)
      const standings = computed.length > 0 ? computed : apiStandings

      setData({ competition, standings, matches, scorers, lastFetch: meta.lastFetch })
      setLastUpdated(meta.lastFetch)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar dados. Tentando novamente...')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error, lastUpdated, refetch: load }
}

export function useMatches() {
  const { data, loading, error } = useData()
  return { matches: data?.matches ?? [], loading, error }
}

export function useStandings() {
  const { data, loading, error } = useData()
  return { standings: data?.standings ?? [], loading, error }
}

export function useScorers() {
  const { data, loading, error } = useData()
  return { scorers: data?.scorers ?? [], loading, error }
}
