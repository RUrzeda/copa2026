import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { GroupsPage } from './pages/GroupsPage'
import { MatchesPage } from './pages/MatchesPage'
import { KnockoutPage } from './pages/KnockoutPage'
import { ScorersPage } from './pages/ScorersPage'
import { TeamsPage } from './pages/TeamsPage'
import { StatsPage } from './pages/StatsPage'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grupos" element={<GroupsPage />} />
          <Route path="/jogos" element={<MatchesPage />} />
          <Route path="/eliminatorias" element={<KnockoutPage />} />
          <Route path="/artilheiros" element={<ScorersPage />} />
          <Route path="/selecoes" element={<TeamsPage />} />
          <Route path="/estatisticas" element={<StatsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
