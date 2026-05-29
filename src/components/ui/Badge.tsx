import clsx from 'clsx'

interface BadgeProps {
  label: string
  variant?: 'live' | 'finished' | 'scheduled' | 'gold' | 'group' | 'default'
  pulse?: boolean
  size?: 'sm' | 'md'
}

export function Badge({ label, variant = 'default', pulse = false, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-full uppercase tracking-wider',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1',
        variant === 'live' && 'bg-red-500/20 text-red-400 border border-red-500/30',
        variant === 'finished' && 'bg-slate-700/50 text-slate-400 border border-slate-600/30',
        variant === 'scheduled' && 'bg-navy-700/50 text-slate-400 border border-navy-600/50',
        variant === 'gold' && 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
        variant === 'group' && 'bg-navy-700 text-slate-300 border border-navy-600',
        variant === 'default' && 'bg-navy-700 text-slate-400',
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
      )}
      {label}
    </span>
  )
}
