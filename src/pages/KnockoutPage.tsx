import { GitBranch, Trophy } from 'lucide-react'
import { useData } from '../hooks/useData'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { isMatchFinished, isMatchLive, getStageLabel } from '../utils/helpers'
import type { Match } from '../types'

// ─── Bracket geometry constants ──────────────────────────────────────────────
const CARD_H = 68       // height of each match card (px)
const SLOT_GAP = 10     // vertical gap between cards within same round
const SLOT_H = CARD_H + SLOT_GAP   // = 78px per slot in R32
const COL_W = 158       // width of each round column (px)
const CONN_W = 30       // width of each connector section (px)
const LINE_COLOR = '#1e3a5f'

// ─── Match card ───────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match | null }) {
  if (!match) {
    return (
      <div
        style={{ height: CARD_H }}
        className="rounded-lg border border-dashed border-navy-700/60 bg-navy-900/30 flex flex-col justify-center"
      >
        <div className="flex items-center gap-2 px-2.5 py-1 border-b border-navy-800">
          <div className="h-3.5 w-3.5 rounded-sm bg-navy-700/60 flex-shrink-0" />
          <span className="text-[11px] text-slate-700 flex-1">A definir</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1">
          <div className="h-3.5 w-3.5 rounded-sm bg-navy-700/60 flex-shrink-0" />
          <span className="text-[11px] text-slate-700 flex-1">A definir</span>
        </div>
      </div>
    )
  }

  const finished = isMatchFinished(match.status)
  const live = isMatchLive(match.status)
  const homeWon = match.score.winner === 'HOME_TEAM'
  const awayWon = match.score.winner === 'AWAY_TEAM'

  return (
    <div
      style={{ height: CARD_H }}
      className={`rounded-lg border overflow-hidden transition-shadow ${
        live
          ? 'border-red-500/40 shadow-lg shadow-red-500/10'
          : finished
          ? 'border-navy-600'
          : 'border-navy-700/70'
      }`}
    >
      {/* Home */}
      <div
        className={`flex items-center gap-2 px-2.5 border-b border-navy-800 ${
          homeWon ? 'bg-green-500/10' : 'bg-navy-800/70'
        }`}
        style={{ height: CARD_H / 2 }}
      >
        <img
          src={match.homeTeam.crest}
          alt={match.homeTeam.tla}
          className="h-4 w-4 object-contain flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <span className={`text-xs font-semibold flex-1 truncate ${homeWon ? 'text-white' : finished ? 'text-slate-500' : 'text-slate-300'}`}>
          {match.homeTeam.tla}
        </span>
        {(finished || live) && (
          <span className={`text-xs font-bold tabular-nums ml-1 ${homeWon ? 'text-white' : 'text-slate-500'}`}>
            {match.score.fullTime.home ?? '—'}
          </span>
        )}
        {live && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />}
      </div>
      {/* Away */}
      <div
        className={`flex items-center gap-2 px-2.5 ${
          awayWon ? 'bg-green-500/10' : 'bg-navy-800/70'
        }`}
        style={{ height: CARD_H / 2 }}
      >
        <img
          src={match.awayTeam.crest}
          alt={match.awayTeam.tla}
          className="h-4 w-4 object-contain flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <span className={`text-xs font-semibold flex-1 truncate ${awayWon ? 'text-white' : finished ? 'text-slate-500' : 'text-slate-300'}`}>
          {match.awayTeam.tla}
        </span>
        {(finished || live) && (
          <span className={`text-xs font-bold tabular-nums ml-1 ${awayWon ? 'text-white' : 'text-slate-500'}`}>
            {match.score.fullTime.away ?? '—'}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Connector between rounds ─────────────────────────────────────────────────
// For each pair of matches in round N, draws a "C" shape connecting to one match in round N+1.
// slotH = slot height of the CURRENT (left) round
function RoundConnector({ matchCount, slotH }: { matchCount: number; slotH: number }) {
  const pairCount = Math.ceil(matchCount / 2)
  const pairH = slotH * 2  // each pair spans 2 slots of the current round

  return (
    <div style={{ width: CONN_W, flexShrink: 0 }}>
      {Array.from({ length: pairCount }).map((_, i) => (
        <div key={i} style={{ height: pairH, position: 'relative' }}>
          {/* Top arm: from center of upper match → down to midpoint */}
          <div
            style={{
              position: 'absolute',
              top: slotH / 2,
              left: 0,
              right: 0,
              height: slotH / 2,
              borderTop: `1px solid ${LINE_COLOR}`,
              borderRight: `1px solid ${LINE_COLOR}`,
            }}
          />
          {/* Bottom arm: from midpoint → up to center of lower match */}
          <div
            style={{
              position: 'absolute',
              top: slotH,
              left: 0,
              right: 0,
              height: slotH / 2,
              borderBottom: `1px solid ${LINE_COLOR}`,
              borderRight: `1px solid ${LINE_COLOR}`,
            }}
          />
          {/* Horizontal output line to next column */}
          <div
            style={{
              position: 'absolute',
              top: slotH - 1,
              left: CONN_W * 0.55,
              right: -4,
              height: 1,
              backgroundColor: LINE_COLOR,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ─── A single round column ────────────────────────────────────────────────────
function RoundColumn({
  title,
  matches,
  slotH,
  highlight = false,
}: {
  title: string
  matches: (Match | null)[]
  slotH: number
  highlight?: boolean
}) {
  return (
    <div style={{ width: COL_W, flexShrink: 0 }}>
      {/* Round title */}
      <div className="text-center mb-3 h-6 flex items-center justify-center">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
            highlight
              ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
              : 'text-slate-600'
          }`}
        >
          {title}
        </span>
      </div>

      {/* Match slots */}
      {matches.map((match, i) => (
        <div
          key={match?.id ?? `empty-${i}`}
          style={{
            height: slotH,
            display: 'flex',
            alignItems: 'center',
            paddingTop: SLOT_GAP / 2,
            paddingBottom: SLOT_GAP / 2,
          }}
        >
          <div style={{ width: '100%' }}>
            <MatchCard match={match} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Final + 3rd place special column ────────────────────────────────────────
function FinalColumn({
  finalMatch,
  thirdMatch,
  slotH,
}: {
  finalMatch: Match | null
  thirdMatch: Match | null
  slotH: number  // slot height of the SF round
}) {
  const totalH = slotH * 2  // total height of the SF column

  return (
    <div style={{ width: COL_W, flexShrink: 0 }}>
      <div className="text-center mb-3 h-6" />
      <div style={{ height: totalH, position: 'relative' }}>
        {/* Final — centered vertically */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
          }}
        >
          <div className="text-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              🏆 Final
            </span>
          </div>
          <MatchCard match={finalMatch} />
          {thirdMatch !== null && (
            <div className="mt-6">
              <div className="text-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-2 py-0.5">
                  3º Lugar
                </span>
              </div>
              <MatchCard match={thirdMatch} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Pad array with nulls ─────────────────────────────────────────────────────
function pad(arr: Match[], len: number): (Match | null)[] {
  return [...arr, ...Array(Math.max(0, len - arr.length)).fill(null)]
}

// ─── Empty bracket preview (pre-Copa) ────────────────────────────────────────
function EmptyBracketPreview() {
  const rounds = [
    { title: 'Rodada de 32', count: 16 },
    { title: 'Oitavas de Final', count: 8 },
    { title: 'Quartas de Final', count: 4 },
    { title: 'Semifinais', count: 2 },
  ]

  return (
    <div className="overflow-x-auto pb-6">
      <div
        className="flex items-start"
        style={{ minWidth: rounds.length * (COL_W + CONN_W) + COL_W + 40 }}
      >
        {rounds.map((round, i) => {
          const slotH = SLOT_H * Math.pow(2, i)
          const nullMatches: (Match | null)[] = Array(round.count).fill(null)
          return (
            <div key={round.title} className="flex items-start">
              <RoundColumn title={round.title} matches={nullMatches} slotH={slotH} />
              <RoundConnector matchCount={round.count} slotH={slotH} />
            </div>
          )
        })}
        <FinalColumn finalMatch={null} thirdMatch={null} slotH={SLOT_H * 8} />
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function KnockoutPage() {
  const { data, loading } = useData()

  if (loading) return <LoadingSpinner />

  const matches = data?.matches ?? []
  const r32 = matches.filter((m) => m.stage === 'ROUND_OF_32')
  const r16 = matches.filter((m) => m.stage === 'ROUND_OF_16')
  const qf  = matches.filter((m) => m.stage === 'QUARTER_FINALS')
  const sf  = matches.filter((m) => m.stage === 'SEMI_FINALS')
  const third = matches.find((m) => m.stage === 'THIRD_PLACE') ?? null
  const final = matches.find((m) => m.stage === 'FINAL') ?? null

  const hasKnockout = r32.length > 0 || r16.length > 0 || qf.length > 0 || sf.length > 0

  // Stats summary
  const finishedKnockout = [...r32, ...r16, ...qf, ...sf].filter((m) => isMatchFinished(m.status))
  const liveKnockout = [...r32, ...r16, ...qf, ...sf].filter((m) => isMatchLive(m.status))

  // Determine which rounds to render based on available data
  const rounds: { title: string; matches: (Match | null)[]; count: number }[] = []

  if (r32.length > 0)  rounds.push({ title: 'Rodada de 32',    matches: pad(r32, 16), count: 16 })
  if (r16.length > 0)  rounds.push({ title: 'Oitavas de Final', matches: pad(r16, 8),  count: 8  })
  if (qf.length > 0)   rounds.push({ title: 'Quartas de Final', matches: pad(qf, 4),   count: 4  })
  if (sf.length > 0)   rounds.push({ title: 'Semifinais',       matches: pad(sf, 2),   count: 2  })

  // Fallback: show at least R32 + R16 if there's any knockout data but only some rounds
  if (hasKnockout && rounds.length === 0) {
    rounds.push({ title: 'Rodada de 32',    matches: pad(r32, 16), count: 16 })
    rounds.push({ title: 'Oitavas de Final', matches: pad(r16, 8),  count: 8  })
    rounds.push({ title: 'Quartas de Final', matches: pad(qf, 4),   count: 4  })
    rounds.push({ title: 'Semifinais',       matches: pad(sf, 2),   count: 2  })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display font-bold text-2xl text-white">Fase Eliminatória</h1>
          {liveKnockout.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              {liveKnockout.length} ao vivo
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm">
          32 seleções · Rodada de 32 → Oitavas → Quartas → Semifinais → Final
        </p>
        {finishedKnockout.length > 0 && (
          <p className="text-xs text-slate-600 mt-1">{finishedKnockout.length} jogos realizados nesta fase</p>
        )}
      </div>

      {/* Bracket stages legend */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-xs text-slate-600">
        {[
          { color: 'bg-green-500/20 border-green-500/30 text-green-400', label: 'Classificado' },
          { color: 'bg-red-500/10 border-red-500/20 text-red-400', label: 'Ao vivo' },
          { color: 'bg-navy-800/60 border-navy-700/60 text-slate-500', label: 'Encerrado' },
          { color: 'bg-navy-900/30 border-dashed border-navy-700/60 text-slate-700', label: 'A definir' },
        ].map(({ color, label }) => (
          <div key={label} className={`flex items-center gap-1.5 border rounded px-2 py-1 ${color}`}>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* No data yet */}
      {!hasKnockout ? (
        <div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-6">
            <Trophy className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300/80">
              O chaveamento eliminatório será preenchido ao término da fase de grupos. Abaixo, uma prévia da estrutura do torneio.
            </p>
          </div>
          <EmptyBracketPreview />
        </div>
      ) : (
        /* Live bracket */
        <div className="overflow-x-auto pb-6">
          <div
            className="flex items-start"
            style={{ minWidth: rounds.length * (COL_W + CONN_W) + COL_W + 40 }}
          >
            {rounds.map((round, i) => {
              const slotH = SLOT_H * Math.pow(2, i)
              const isLast = i === rounds.length - 1
              return (
                <div key={round.title} className="flex items-start">
                  <RoundColumn
                    title={round.title}
                    matches={round.matches}
                    slotH={slotH}
                  />
                  {!isLast && (
                    <RoundConnector matchCount={round.count} slotH={slotH} />
                  )}
                </div>
              )
            })}

            {/* Connector from SF to Final */}
            {sf.length > 0 && (
              <RoundConnector matchCount={2} slotH={SLOT_H * Math.pow(2, rounds.length - 1)} />
            )}

            {/* Final + 3rd place */}
            <FinalColumn
              finalMatch={final}
              thirdMatch={third}
              slotH={SLOT_H * Math.pow(2, rounds.length - 1)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
