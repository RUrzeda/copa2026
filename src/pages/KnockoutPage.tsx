import { Trophy } from 'lucide-react'
import { useData } from '../hooks/useData'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { isMatchFinished, isMatchLive } from '../utils/helpers'
import type { Match } from '../types'

// ─── Geometry ─────────────────────────────────────────────────────────────────
const CARD_H  = 62           // px — match card height
const TITLE_H = 32           // px — title row above each column
const R32_N   = 16           // matches in Round of 32
const SLOT0   = 76           // px — slot height for R32 (must be >= CARD_H)
const TOTAL_H = R32_N * SLOT0  // = 1216px — total bracket height (same for all rounds)
const COL_W   = 156          // px — each round column width
const CONN_W  = 32           // px — gap between columns (for connector lines)
const COL_STRIDE = COL_W + CONN_W  // = 188px — column + connector
const N_ROUNDS = 4           // R32, R16, QF, SF
const CONTAINER_W = N_ROUNDS * COL_STRIDE + COL_W  // = 908px
const CONTAINER_H = TITLE_H + TOTAL_H              // = 1248px

const LINE_COLOR  = '#1e3a5f'
const LINE_LIVE   = '#ef4444'
const GOLD        = '#f0b429'

// ─── Pre-calculate positions ──────────────────────────────────────────────────
/** Slot height for a given round index (doubles each round) */
function slotH(r: number) { return SLOT0 * Math.pow(2, r) }

/** Pixel Y of the top of the match card in absolute container coords */
function cardTopY(roundIdx: number, matchIdx: number): number {
  const s = slotH(roundIdx)
  return TITLE_H + matchIdx * s + (s - CARD_H) / 2
}

/** Pixel Y of the vertical center of a match card */
function cardCenterY(roundIdx: number, matchIdx: number): number {
  return cardTopY(roundIdx, matchIdx) + CARD_H / 2
}

/** Pixel X of the left edge of a round column */
function colX(roundIdx: number): number { return roundIdx * COL_STRIDE }

// Final + 3rd place positions
const FINAL_COL_X  = N_ROUNDS * COL_STRIDE           // x of Final card
const FINAL_CY     = TITLE_H + TOTAL_H / 2           // connector feeds here (y center)
const FINAL_TOP    = FINAL_CY - CARD_H / 2           // card top y
const FINAL_LABEL_TOP = FINAL_TOP - 22               // "🏆 Final" label directly above card

// 3rd place: offset to the right of the Final card
const THIRD_COL_X  = FINAL_COL_X + CONN_W            // slightly more to the right
const THIRD_CY     = FINAL_CY + CARD_H / 2 + 48      // below Final
const THIRD_TOP    = THIRD_CY - CARD_H / 2

const CONTAINER_W_FULL = THIRD_COL_X + COL_W         // wider to fit 3rd place

// ─── Match card ────────────────────────────────────────────────────────────────
function MatchCard({ match, width = COL_W }: { match: Match | null; width?: number }) {
  if (!match) {
    return (
      <div
        style={{ width, height: CARD_H }}
        className="rounded-lg border border-dashed border-navy-700/50 bg-navy-900/20 flex flex-col"
      >
        {[0, 1].map(i => (
          <div key={i} className={`flex-1 flex items-center gap-2 px-2.5 ${i === 0 ? 'border-b border-navy-800/50' : ''}`}>
            <div className="h-3 w-3 rounded bg-navy-800 flex-shrink-0" />
            <span className="text-[11px] text-navy-700">A definir</span>
          </div>
        ))}
      </div>
    )
  }

  const finished = isMatchFinished(match.status)
  const live     = isMatchLive(match.status)
  const homeWon  = match.score.winner === 'HOME_TEAM'
  const awayWon  = match.score.winner === 'AWAY_TEAM'

  function Row({ side }: { side: 'home' | 'away' }) {
    if (!match) return null
    const team  = side === 'home' ? match.homeTeam : match.awayTeam
    const won   = side === 'home' ? homeWon : awayWon
    const score = side === 'home' ? match.score.fullTime.home : match.score.fullTime.away
    return (
      <div
        className={`flex-1 flex items-center gap-2 px-2.5 ${
          side === 'home' ? 'border-b border-navy-800/60' : ''
        } ${won ? 'bg-green-500/10' : 'bg-navy-800/60'}`}
      >
        {team?.crest
          ? <img src={team.crest} alt="" className="h-3.5 w-3.5 object-contain flex-shrink-0"
              onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
          : <div className="h-3.5 w-3.5 rounded bg-navy-700 flex-shrink-0" />
        }
        <span className={`text-[11px] font-semibold flex-1 truncate ${
          won ? 'text-white' : finished ? 'text-slate-500' : 'text-slate-300'
        }`}>
          {team?.tla || team?.shortName || '?'}
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
      style={{ width, height: CARD_H }}
      className={`rounded-lg border overflow-hidden flex flex-col ${
        live ? 'border-red-500/40 shadow-red-500/10 shadow-md' : 'border-navy-600/60'
      }`}
    >
      <Row side="home" />
      <Row side="away" />
    </div>
  )
}

// ─── SVG connector overlay ────────────────────────────────────────────────────
// Draws the bracket connector lines using precise coordinates.
function BracketSVG({ hasAnyData }: { hasAnyData: boolean }) {
  const strokeColor = hasAnyData ? LINE_COLOR : '#0f1e30'

  const elements: React.ReactNode[] = []

  // R32→R16, R16→QF, QF→SF connectors
  for (let r = 0; r < 3; r++) {
    const pairCount = R32_N / Math.pow(2, r + 1)  // 8, 4, 2
    const curRightX = colX(r) + COL_W
    const stemX     = curRightX + CONN_W / 2
    const nextLeftX = colX(r + 1)

    for (let p = 0; p < pairCount; p++) {
      const ay   = cardCenterY(r, p * 2)
      const by   = cardCenterY(r, p * 2 + 1)
      const ab_y = cardCenterY(r + 1, p)

      elements.push(
        <g key={`c${r}-${p}`} stroke={strokeColor} strokeWidth="1" fill="none">
          {/* C-shape: right from A, down, right from B */}
          <polyline points={`${curRightX},${ay} ${stemX},${ay} ${stemX},${by} ${curRightX},${by}`} />
          {/* Output line to next round */}
          <line x1={stemX} y1={ab_y} x2={nextLeftX} y2={ab_y} />
        </g>
      )
    }
  }

  // SF → Final connector
  {
    const sfRightX  = colX(3) + COL_W
    const sfStemX   = sfRightX + CONN_W / 2
    const finalLeftX = FINAL_COL_X
    const sf0_y = cardCenterY(3, 0)
    const sf1_y = cardCenterY(3, 1)

    elements.push(
      <g key="sf-final" stroke={strokeColor} strokeWidth="1" fill="none">
        <polyline points={`${sfRightX},${sf0_y} ${sfStemX},${sf0_y} ${sfStemX},${sf1_y} ${sfRightX},${sf1_y}`} />
        <line x1={sfStemX} y1={FINAL_CY} x2={finalLeftX} y2={FINAL_CY} />
      </g>
    )
  }

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: CONTAINER_W,
        height: CONTAINER_H,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      {elements}
    </svg>
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

  const r32   = matches.filter(m => (m.stage as string) === 'LAST_32'       || m.stage === 'ROUND_OF_32')
  const r16   = matches.filter(m => (m.stage as string) === 'LAST_16'       || m.stage === 'ROUND_OF_16')
  const qf    = matches.filter(m => m.stage === 'QUARTER_FINALS')
  const sf    = matches.filter(m => m.stage === 'SEMI_FINALS')
  const third = matches.find(m  => m.stage === 'THIRD_PLACE') ?? null
  const final = matches.find(m  => m.stage === 'FINAL')       ?? null

  const hasAny = r32.length + r16.length + qf.length + sf.length > 0
  const liveNow = [...r32, ...r16, ...qf, ...sf].filter(m => isMatchLive(m.status))

  // Always pad all 4 rounds to their full count
  const ROUNDS = [
    { title: 'Rodada de 32',     matches: pad(r32, 16), roundIdx: 0 },
    { title: 'Oitavas de Final', matches: pad(r16, 8),  roundIdx: 1 },
    { title: 'Quartas de Final', matches: pad(qf, 4),   roundIdx: 2 },
    { title: 'Semifinais',       matches: pad(sf, 2),   roundIdx: 3 },
  ]

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
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {[
          { cls: 'bg-green-500/10 border border-green-500/20 text-green-400', label: 'Classificado' },
          { cls: 'bg-red-500/10 border border-red-500/20 text-red-400',        label: 'Ao vivo'     },
          { cls: 'bg-navy-800/60 border border-navy-600/70 text-slate-500',    label: 'Encerrado'   },
          { cls: 'border border-dashed border-navy-700/50 text-navy-700',      label: 'A definir'   },
        ].map(({ cls, label }) => (
          <span key={label} className={`text-[11px] font-medium px-2.5 py-1 rounded-md ${cls}`}>{label}</span>
        ))}
      </div>

      {/* Info banner */}
      {!hasAny && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-6">
          <Trophy className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300/80">
            O chaveamento será preenchido ao término da fase de grupos.
            O bracket abaixo mostra a estrutura completa do torneio.
          </p>
        </div>
      )}

      {/* ── Bracket ──────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div
          style={{
            position: 'relative',
            width:  CONTAINER_W_FULL,
            height: CONTAINER_H,
            minWidth: CONTAINER_W_FULL,
          }}
        >
          {/* SVG connector lines (drawn under the cards) */}
          <BracketSVG hasAnyData={hasAny} />

          {/* Column titles */}
          {ROUNDS.map(({ title, roundIdx }) => (
            <div
              key={title}
              style={{
                position: 'absolute',
                left: colX(roundIdx),
                top: 0,
                width: COL_W,
                height: TITLE_H,
              }}
              className="flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {title}
              </span>
            </div>
          ))}

          {/* "🏆 Final" label — directly above the Final card */}
          <div
            style={{
              position: 'absolute',
              left: FINAL_COL_X,
              top: FINAL_LABEL_TOP,
              width: COL_W,
              height: 20,
            }}
            className="flex items-center justify-center"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              🏆 Final
            </span>
          </div>

          {/* Match cards — all 4 rounds */}
          {ROUNDS.map(({ matches, roundIdx }) =>
            matches.map((match, matchIdx) => (
              <div
                key={match?.id ?? `${roundIdx}-${matchIdx}`}
                style={{
                  position: 'absolute',
                  left: colX(roundIdx),
                  top:  cardTopY(roundIdx, matchIdx),
                  width: COL_W,
                  height: CARD_H,
                  zIndex: 1,
                }}
              >
                <MatchCard match={match} />
              </div>
            ))
          )}

          {/* Final card */}
          <div
            style={{
              position: 'absolute',
              left: FINAL_COL_X,
              top:  FINAL_TOP,
              width: COL_W,
              height: CARD_H,
              zIndex: 1,
            }}
          >
            <MatchCard match={final} />
          </div>

          {/* 3º Lugar label + card — slightly to the right of Final */}
          <div
            style={{
              position: 'absolute',
              left: THIRD_COL_X,
              top:  THIRD_TOP - 20,
              width: COL_W,
            }}
          >
            <div className="text-center mb-1.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                3º Lugar
              </span>
            </div>
            <MatchCard match={third} />
          </div>
        </div>
      </div>
    </div>
  )
}
