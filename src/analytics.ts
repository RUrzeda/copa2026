declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    GA_ID?: string
    ADSENSE_ID?: string
    adsbygoogle?: unknown[]
  }
}

function hasGA(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/** Track a page view — call on every route change */
export function trackPageView(path: string, title?: string): void {
  if (!hasGA() || !window.GA_ID) return
  window.gtag!('config', window.GA_ID, {
    page_path: path,
    page_title: title,
  })
}

/** Track a custom event */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
): void {
  if (!hasGA()) return
  window.gtag!('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

// Convenience event helpers
export const Analytics = {
  viewGroup:    (group: string)  => trackEvent('view_group',    'engagement', group),
  viewMatch:    (matchId: number) => trackEvent('view_match',   'engagement', String(matchId)),
  viewScorers:  ()               => trackEvent('view_scorers',  'engagement'),
  viewBracket:  ()               => trackEvent('view_bracket',  'engagement'),
  viewTeam:     (team: string)   => trackEvent('view_team',     'engagement', team),
  shareContent: (method: string) => trackEvent('share',         'engagement', method),
  refreshData:  ()               => trackEvent('refresh_data',  'engagement'),
}
