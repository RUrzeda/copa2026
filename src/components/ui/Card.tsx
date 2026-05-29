import { type ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-navy-600 bg-card-gradient p-4',
        hover && 'transition-all duration-200 hover:border-gold-500/40 hover:shadow-lg hover:shadow-gold-500/5 cursor-pointer',
        glow && 'shadow-lg shadow-gold-500/10 border-gold-500/20',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gold-500">{icon}</span>}
        <div>
          <h3 className="font-display font-semibold text-slate-100 text-sm uppercase tracking-wider">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
