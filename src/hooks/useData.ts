import { useState, useEffect } from 'react'
import type { ApiData, Match, GroupStanding, Scorer } from '../types'

const BASE_PATH = import.meta.env.BASE_URL

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_PATH}${path}?t=${Date.now()}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return res.json()
}

export function useData() {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const load = async () => {
    try {
      const [competition, standings, matches, scorers] = await Promise.all([
        fetchJson<ApiData['competition']>('data/competition.json').catch(() => null),
        fetchJson<GroupStanding[]>('data/standings.json').catch(() => []),
        fetchJson<Match[]>('data/matches.json').catch(() => []),
        fetchJson<Scorer[]>('data/scorers.json').catch(() => []),
      ])

      const meta = await fetchJson<{ lastFetch: string }>('data/meta.json').catch(() => ({
        lastFetch: new Date().toISOString(),
      }))

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
