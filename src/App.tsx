import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { GroupsPage } from './pages/GroupsPage'
import { MatchesPage } from './pages/MatchesPage'
import { KnockoutPage } from './pages/KnockoutPage'
import { ScorersPage } from './pages/ScorersPage'
import { TeamsPage } from './pages/TeamsPage'
import { StatsPage } from './pages/StatsPage'
import { trackPageView } from './analytics'

const PAGE_TITLES: Record<string, string> = {
  '/':             'Dashboard — Painel da Copa 2026',
  '/grupos':       'Grupos — Painel da Copa 2026',
  '/jogos':        'Jogos — Painel da Copa 2026',
  '/eliminatorias':'Fase Eliminatória — Painel da Copa 2026',
  '/artilheiros':  'Artilheiros — Painel da Copa 2026',
  '/selecoes':     'Seleções — Painel da Copa 2026',
  '/estatisticas': 'Estatísticas — Painel da Copa 2026',
}

function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] ?? 'Painel da Copa 2026'
    document.title = title
    trackPageView(location.pathname, title)
  }, [location.pathname])

  return null
}

export default function App() {
  return (
    <HashRouter>
      <PageTracker />
      <Layout>
        <Routes>
          <Route path="/"              element={<HomePage />} />
          <Route path="/grupos"        element={<GroupsPage />} />
          <Route path="/jogos"         element={<MatchesPage />} />
          <Route path="/eliminatorias" element={<KnockoutPage />} />
          <Route path="/artilheiros"   element={<ScorersPage />} />
          <Route path="/selecoes"      element={<TeamsPage />} />
          <Route path="/estatisticas"  element={<StatsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
