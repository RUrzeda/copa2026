interface PlayerAvatarProps {
  name: string
  photo?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE = {
  sm: { box: 'h-8 w-8',   text: 'text-xs' },
  md: { box: 'h-10 w-10', text: 'text-sm' },
  lg: { box: 'h-14 w-14', text: 'text-base' },
}

function initials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function PlayerAvatar({ name, photo, size = 'md', className = '' }: PlayerAvatarProps) {
  const { box, text } = SIZE[size]

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${box} rounded-full object-cover flex-shrink-0 border border-navy-600 ${className}`}
        onError={e => {
          const el = e.currentTarget
          el.style.display = 'none'
          const next = el.nextElementSibling as HTMLElement | null
          if (next) next.style.display = 'flex'
        }}
      />
    )
  }

  return (
    <div
      className={`${box} rounded-full flex items-center justify-center flex-shrink-0 border border-navy-600 bg-navy-700 font-bold ${text} text-slate-300 select-none ${className}`}
    >
      {initials(name)}
    </div>
  )
}
