#!/usr/bin/env node
/**
 * Fetches World Cup 2026 data from football-data.org and saves as static JSON.
 * Runs via GitHub Actions on a schedule. API key is read from environment.
 *
 * Usage:
 *   FOOTBALL_API_KEY=your_key node scripts/fetch-data.js
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, '..', 'public', 'data')

const API_KEY = process.env.FOOTBALL_API_KEY
const BASE_URL = 'https://api.football-data.org/v4'
const COMPETITION = 'WC'  // World Cup code on football-data.org

if (!API_KEY) {
  console.error('❌  FOOTBALL_API_KEY environment variable is required')
  process.exit(1)
}

const headers = {
  'X-Auth-Token': API_KEY,
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers })

      if (res.status === 429) {
        const wait = parseInt(res.headers.get('X-RequestCounter-Reset') ?? '60', 10)
        console.log(`⏳  Rate limited. Waiting ${wait}s...`)
        await new Promise(r => setTimeout(r, wait * 1000))
        continue
      }

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text}`)
      }

      return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
      console.warn(`⚠️   Attempt ${i + 1} failed: ${err.message}. Retrying...`)
      await new Promise(r => setTimeout(r, 2000 * (i + 1)))
    }
  }
}

function save(filename, data) {
  const path = join(OUTPUT_DIR, filename)
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
  console.log(`✅  Saved ${filename}`)
}

async function main() {
  console.log('🚀  Starting data fetch for FIFA World Cup 2026...')
  mkdirSync(OUTPUT_DIR, { recursive: true })

  try {
    // 1. Competition info
    console.log('📡  Fetching competition info...')
    const competition = await fetchWithRetry(`${BASE_URL}/competitions/${COMPETITION}`)
    save('competition.json', competition)

    await sleep(1000)

    // 2. Standings (groups)
    console.log('📡  Fetching standings...')
    const standingsData = await fetchWithRetry(`${BASE_URL}/competitions/${COMPETITION}/standings`)
    save('standings.json', standingsData.standings ?? [])

    await sleep(1000)

    // 3. All matches
    console.log('📡  Fetching matches...')
    const matchesData = await fetchWithRetry(`${BASE_URL}/competitions/${COMPETITION}/matches`)
    save('matches.json', matchesData.matches ?? [])

    await sleep(1000)

    // 4. Top scorers
    console.log('📡  Fetching scorers...')
    const scorersData = await fetchWithRetry(
      `${BASE_URL}/competitions/${COMPETITION}/scorers?limit=50`
    )
    save('scorers.json', scorersData.scorers ?? [])

    // 5. Meta
    const meta = { lastFetch: new Date().toISOString() }
    save('meta.json', meta)

    console.log(`\n🏆  Done! Data updated at ${meta.lastFetch}`)
  } catch (err) {
    console.error(`\n❌  Fatal error: ${err.message}`)
    process.exit(1)
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

main()
