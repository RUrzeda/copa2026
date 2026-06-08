import { Trophy, RefreshCw } from 'lucide-react'
import { useData } from '../../hooks/useData'
import { formatMatchDate } from '../../utils/helpers'
import { ShareSite } from '../ui/ShareButton'

export function Footer() {
  const { lastUpdated, refetch } = useData()

  return (
    <footer className="border-t border-navy-700 bg-navy-950 mt-12">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gold-gradient p-1.5 rounded-full">
              <Trophy className="h-4 w-4 text-navy-950" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">Copa do Mundo 2026</div>
              <div className="text-xs text-slate-500">Dados via football-data.org</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {lastUpdated && (
              <div className="flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3" />
                Atualizado: {new Date(lastUpdated).toLocaleString('pt-BR')}
              </div>
            )}
            <button
              onClick={refetch}
              className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Atualizar agora
            </button>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <ShareSite />
            <div className="text-xs text-slate-600">
              © 2026 Painel da Copa · Todos os direitos reservados
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
