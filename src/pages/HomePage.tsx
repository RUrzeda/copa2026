import { HeroBanner } from '../components/dashboard/HeroBanner'
import { StatsBar } from '../components/dashboard/StatsBar'
import { NextMatches } from '../components/dashboard/NextMatches'
import { RecentResults } from '../components/dashboard/RecentResults'
import { TopScorersWidget } from '../components/dashboard/TopScorersWidget'
import { GroupsOverview } from '../components/dashboard/GroupsOverview'

export function HomePage() {
  return (
    <div className="space-y-6">
      <HeroBanner />
      <StatsBar />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <NextMatches />
        <RecentResults />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <GroupsOverview />
        </div>
        <div>
          <TopScorersWidget />
        </div>
      </div>
    </div>
  )
}
