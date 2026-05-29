import { useState, useEffect } from 'react'
import { getCountdownToWorldCup } from '../../utils/helpers'

interface TimeBlockProps {
  value: number
  label: string
}

function TimeBlock({ value, label }: TimeBlockProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 min-w-[52px] text-center">
          <span className="font-display font-bold text-2xl text-gold-400 tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{label}</span>
    </div>
  )
}

export function CountdownTimer() {
  const [countdown, setCountdown] = useState(getCountdownToWorldCup())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownToWorldCup())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (countdown.started) {
    return (
      <div className="flex items-center gap-2 text-pitch-500 font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pitch-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-pitch-500" />
        </span>
        Copa em Andamento
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <TimeBlock value={countdown.days} label="dias" />
      <span className="text-gold-500 font-bold text-xl mb-4">:</span>
      <TimeBlock value={countdown.hours} label="horas" />
      <span className="text-gold-500 font-bold text-xl mb-4">:</span>
      <TimeBlock value={countdown.minutes} label="min" />
      <span className="text-gold-500 font-bold text-xl mb-4">:</span>
      <TimeBlock value={countdown.seconds} label="seg" />
    </div>
  )
}
