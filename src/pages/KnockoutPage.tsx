import { Trophy } from 'lucide-react'
import { useData } from '../hooks/useData'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { isMatchFinished, isMatchLive } from '../utils/helpers'
import type { Match } from '../types'

// ─── Geometry ─────────────────────────────────────────────────────────────────
const CARD_H  = 66        // height of one match card
const SLOT_H0 = CARD_H + 10  // slot height for the first round (LAST_32) = 76px
const R32_N   = 16        // number of matches in LAST_32
const TOTAL_H = R32_N * SLOT_H0  // = 1216px — constant across all rounds
const COL_W   = 160       // column width
const CONN_W  = 28        // connector width
const LINE    = '#1e3a5f' // connector line colour

// slot height doubles each round: round 0 = 76px, 1 = 152px, 2 = 304px, 3 = 608px
function sh(round: number) { return SLOT_H0 * Math.pow(2, round) }

// ─── Stage name map (API uses LAST_32 / LAST_16) ──────────────────────────────
const STAGE_LABEL: Record<string, string> = {
  LAST_32:       'Rodada de 32',
  LAST_16:       'Oitavas de Final',
  QUARTER_FINALS:'Quartas de Final',
  SEMI_FINALS:   'Semifinais',
  THIRD_PLACE:   '3º Lugar',
  FINAL:         'Final',
  // Fallback names some API versions might use
  ROUND_OF_32:   'Rodada de 32',
  ROUND_OF_16:   'Oitavas de Final',
}

// ─── Match card ────────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match | null }) {
  if (!match) {
    return (
      <div
        style={{ height: CARD_H }}
        className="rounded-lg border border-dashed border-navy-700/50 bg-navy-900/20 flex flex-col"
      >
        {[0, 1].map(i => (
          <div key={i} className={`flex-1 flex items-center gap-2 px-2.5 ${i === 0 ? 'border-b border-navy-800/60' : ''}`}>
            <div className="h-3.5 w-3.5 rounded bg-navy-800 flex-shrink-0" />
            <span className="text-[11px] text-navy-600">A definir</span>
          </div>
        ))}
      </div>
    )
  }

  const finished = isMatchFinished(match.status)
  const live     = isMatchLive(match.status)
  const homeWon  = match.score.winner === 'HOME_TEAM'
  const awayWon  = match.score.winner === 'AWAY_TEAM'

  function TeamRow({ side }: { side: 'home' | 'away' }) {
    if (!match) return null
    const team  = side === 'home' ? match.homeTeam : match.awayTeam
    const won   = side === 'home' ? homeWon : awayWon
    const score = side === 'home' ? match.score.fullTime.home : match.score.fullTime.away
    const isFirst = side === 'home'

    return (
      <div
        className={`flex-1 flex items-center gap-2 px-2.5 ${isFirst ? 'border-b border-navy-800/60' : ''} ${won ? 'bg-green-500/10' : 'bg-navy-800/60'}`}
      >
        {team.crest ? (
          <img src={team.crest} alt="" className="h-3.5 w-3.5 object-contain flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
        ) : (
          <div className="h-3.5 w-3.5 rounded bg-navy-700 flex-shrink-0" />
        )}
        <span className={`text-[11px] font-semibold flex-1 truncate ${won ? 'text-white' : finished ? 'text-slate-500' : 'text-slate-300'}`}>
          {team.tla || team.shortName || '?'}
        </span>
        {(finished || live) && (
          <span className={`text-xs font-bold tabular-nums ${won ? 'text-white' : 'text-slate-600'}`}>
            {score ?? '—'}
          </span>
        )}
        {live && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />}
      </div>
    )
  }

  return (
    <div
      style={{ height: CARD_H }}
      className={`rounded-lg border overflow-hidden flex flex-col ${
        live ? 'border-red-500/30 shadow-red-500/10 shadow-md' : 'border-navy-600/70'
      }`}
    >
      <TeamRow side="home" />
      <TeamRow side="away" />
    </div>
  )
}

// ─── Connector between two adjacent rounds ────────────────────────────────────
// Draws C-shaped connectors. `roundIdx` = index of the LEFT round (0 = LAST_32).
function Connector({ roundIdx }: { roundIdx: number }) {
  const slotA = sh(roundIdx)       // slot height of current (left) round
  const pairH = slotA * 2          // each connector pair spans 2 slots
  const pairCount = R32_N / Math.pow(2, roundIdx + 1)  // pairs in this connector

  return (
    <div style={{ width: CONN_W, flexShrink: 0, marginTop: SLOT_H0 / 2 /* align title row */ }}>
      {Array.from({ length: pairCount }).map((_, i) => (
        <div key={i} style={{ height: pairH, position: 'relative' }}>
          {/* Top arm */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0, right: 0,
            height: slotA / 2,
            borderTop:   `1px solid ${LINE}`,
            borderRight: `1px solid ${LINE}`,
          }} />
          {/* Bottom arm */}
          <div style={{
            position: 'absolute',
            top: slotA,
            left: 0, right: 0,
            height: slotA / 2,
            borderBottom: `1px solid ${LINE}`,
            borderRight:  `1px solid ${LINE}`,
          }} />
          {/* Horizontal output line to next column */}
          <div style={{
            position: 'absolute',
            top: slotA - 1,
            left: CONN_W * 0.55,
            right: -4,
            height: 1,
            backgroundColor: LINE,
          }} />
        </div>
      ))}
    </div>
  )
}

// ─── Round column ──────────────────────────────────────────────────────────────
function RoundCol({
  title, matches, roundIdx,
}: {
  title: string
  matches: (Match | null)[]
  roundIdx: number
}) {
  const slotHeight = sh(roundIdx)

  return (
    <div style={{ width: COL_W, flexShrink: 0 }}>
      {/* Title row */}
      <div className="h-8 flex items-center justify-center mb-1">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{title}</span>
      </div>
      {/* Match slots */}
      {matches.map((m, i) => (
        <div
          key={m?.id ?? `e${i}`}
          style={{
            height: slotHeight,
            display: 'flex',
            alignItems: 'center',
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <div className="w-full">
            <MatchCard match={m} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Final + 3rd place column ──────────────────────────────────────────────────
// Final is centered at TOTAL_H / 2; 3rd place at TOTAL_H * 0.75.
function FinalCol({ finalMatch, thirdMatch }: { finalMatch: Match | null; thirdMatch: Match | null }) {
  const finalTop  = TOTAL_H / 2 - CARD_H / 2 - 24  // 24 = title+gap
  const thirdTop  = TOTAL_H * 0.75 - CARD_H / 2 - 24

  return (
    <div style={{ width: COL_W, flexShrink: 0 }}>
      {/* Title spacer matching other columns */}
      <div className="h-8 mb-1" />
      <div style={{ height: TOTAL_H, position: 'relative' }}>
        {/* Final */}
        <div style={{ position: 'absolute', top: finalTop, width: '100%' }}>
          <div className="text-center mb-1.5">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              🏆 Final
            </span>
          </div>
          <MatchCard match={finalMatch} />
        </div>

        {/* 3rd place */}
        <div style={{ position: 'absolute', top: thirdTop, width: '100%' }}>
          <div className="text-center mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5">
              3º Lugar
            </span>
          </div>
          <MatchCard match={thirdMatch} />
        </div>
      </div>
    </div>
  )
}

// ─── Pad to length ─────────────────────────────────────────────────────────────
function pad(arr: Match[], len: number): (Match | null)[] {
  return [...arr, ...Array(Math.max(0, len - arr.length)).fill(null)]
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export function KnockoutPage() {
  const { data, loading } = useData()

  if (loading) return <LoadingSpinner />

  const matches = data?.matches ?? []

  // API uses LAST_32 / LAST_16 — handle both naming conventions
  const r32   = matches.filter(m => (m.stage as string) === 'LAST_32' || (m.stage as string) === 'ROUND_OF_32')
  const r16   = matches.filter(m => (m.stage as string) === 'LAST_16' || (m.stage as string) === 'ROUND_OF_16')
  const qf    = matches.filter(m => m.stage === 'QUARTER_FINALS')
  const sf    = matches.filter(m => m.stage === 'SEMI_FINALS')
  const third = matches.find(m  => m.stage === 'THIRD_PLACE')   ?? null
  const final = matches.find(m  => m.stage === 'FINAL')         ?? null

  const hasAnyKnockout = r32.length + r16.length + qf.length + sf.length > 0
  const liveNow = [...r32, ...r16, ...qf, ...sf].filter(m => isMatchLive(m.status))

  const ROUNDS = [
    { title: 'Rodada de 32',    matches: pad(r32, 16), roundIdx: 0 },
    { title: 'Oitavas de Final', matches: pad(r16, 8),  roundIdx: 1 },
    { title: 'Quartas de Final', matches: pad(qf, 4),   roundIdx: 2 },
    { title: 'Semifinais',       matches: pad(sf, 2),   roundIdx: 3 },
  ]

  // Total width: 4 columns + 4 connectors (SF→Final) + 1 Final column
  const totalWidth = 4 * COL_W + 4 * CONN_W + COL_W + 24

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="font-display font-bold text-2xl text-white">Fase Eliminatória</h1>
          {liveNow.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              {liveNow.length} ao vivo
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm">
          32 seleções · Rodada de 32 → Oitavas → Quartas → Semifinais → Final
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { cls: 'bg-green-500/10 border border-green-500/20 text-green-400',  label: 'Classificado' },
          { cls: 'bg-red-500/10  border border-red-500/20  text-red-400',    label: 'Ao vivo'     },
          { cls: 'bg-navy-800/60 border border-navy-600/70 text-slate-500',  label: 'Encerrado'   },
          { cls: 'border border-dashed border-navy-700/50  text-navy-600',   label: 'A definir'   },
        ].map(({ cls, label }) => (
          <span key={label} className={`text-[11px] font-medium px-2.5 py-1 rounded-md ${cls}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Info banner before knockout starts */}
      {!hasAnyKnockout && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-6">
          <Trophy className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300/80">
            O chaveamento será preenchido ao término da fase de grupos (após 72 jogos).
            O bracket abaixo mostra a estrutura do torneio.
          </p>
        </div>
      )}

      {/* Bracket — always renders all 4 rounds */}
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex" style={{ minWidth: totalWidth }}>
          {ROUNDS.map((round, i) => (
            <div key={round.title} className="flex">
              <RoundCol
                title={round.title}
                matches={round.matches}
                roundIdx={round.roundIdx}
              />
              {/* Connector to next round */}
              <Connector roundIdx={round.roundIdx} />
            </div>
          ))}

          {/* Final + 3rd place */}
          <FinalCol finalMatch={final} thirdMatch={third} />
        </div>
      </div>
    </div>
  )
}
