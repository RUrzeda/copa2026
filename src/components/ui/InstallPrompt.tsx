import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!visible || !prompt) return null

  const install = async () => {
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setVisible(false)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-slide-up">
      <div className="flex items-center gap-3 p-3 rounded-xl border border-gold-500/30 bg-navy-900/95 backdrop-blur-md shadow-xl shadow-black/40">
        <div className="bg-gold-gradient p-2 rounded-lg flex-shrink-0">
          <Download className="h-4 w-4 text-navy-950" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">Instalar app</div>
          <div className="text-xs text-slate-400">Acesse a Copa direto da tela inicial</div>
        </div>
        <button
          onClick={install}
          className="flex-shrink-0 text-xs font-semibold text-gold-400 hover:text-gold-300 bg-gold-500/10 hover:bg-gold-500/20 px-3 py-1.5 rounded-lg transition-all"
        >
          Instalar
        </button>
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 text-slate-600 hover:text-slate-400 transition-colors p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
