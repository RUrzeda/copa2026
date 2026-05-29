import clsx from 'clsx'

interface TeamFlagProps {
  crest: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-14 w-14',
}

export function TeamFlag({ crest, name, size = 'md', className }: TeamFlagProps) {
  return (
    <img
      src={crest}
      alt={name}
      className={clsx('object-contain', sizeMap[size], className)}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.src = `https://via.placeholder.com/40?text=${name.charAt(0)}`
      }}
    />
  )
}

interface TeamNameProps {
  crest: string
  name: string
  shortName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showFull?: boolean
  reverse?: boolean
}

export function TeamWithFlag({ crest, name, shortName, size = 'sm', showFull = false, reverse = false }: TeamNameProps) {
  return (
    <div className={clsx('flex items-center gap-2', reverse && 'flex-row-reverse')}>
      <TeamFlag crest={crest} name={name} size={size} />
      <span className="text-slate-100 font-medium text-sm truncate">
        {showFull ? name : (shortName ?? name)}
      </span>
    </div>
  )
}
