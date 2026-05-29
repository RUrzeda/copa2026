import { useEffect, useRef } from 'react'
import clsx from 'clsx'

type AdFormat = 'leaderboard' | 'rectangle' | 'responsive'

interface AdBannerProps {
  slot: string          // AdSense ad unit slot ID
  format?: AdFormat
  className?: string
}

const FORMAT_STYLES: Record<AdFormat, string> = {
  leaderboard: 'min-h-[90px] w-full',
  rectangle:   'min-h-[250px] w-full max-w-[300px]',
  responsive:  'min-h-[100px] w-full',
}

export function AdBanner({ slot, format = 'responsive', className }: AdBannerProps) {
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    const adsenseId = window.ADSENSE_ID
    if (!adsenseId || adsenseId === '%VITE_ADSENSE_ID%' || pushed.current) return

    try {
      pushed.current = true
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (_) {
      // AdSense not loaded yet — silently ignore
    }
  }, [])

  // Don't render if AdSense not configured
  if (!window.ADSENSE_ID || window.ADSENSE_ID === '%VITE_ADSENSE_ID%') {
    return null
  }

  return (
    <div className={clsx('flex items-center justify-center overflow-hidden', className)}>
      <ins
        ref={insRef}
        className={clsx('adsbygoogle block', FORMAT_STYLES[format])}
        data-ad-client={window.ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={format === 'responsive' ? 'true' : undefined}
      />
    </div>
  )
}

/** Horizontal banner — goes between content sections */
export function AdLeaderboard({ slot, className }: { slot: string; className?: string }) {
  return (
    <AdBanner
      slot={slot}
      format="leaderboard"
      className={clsx('my-4 rounded-lg overflow-hidden', className)}
    />
  )
}

/** Sidebar / in-feed rectangle */
export function AdRectangle({ slot, className }: { slot: string; className?: string }) {
  return (
    <AdBanner
      slot={slot}
      format="rectangle"
      className={clsx('my-2 mx-auto rounded-lg overflow-hidden', className)}
    />
  )
}
