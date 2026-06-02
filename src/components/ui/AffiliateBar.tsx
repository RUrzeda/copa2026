interface Affiliate {
  name: string
  description: string
  url: string
  cta: string
}

const AFFILIATES: Affiliate[] = [
  {
    name: 'Betano',
    description: 'Apostas esportivas',
    url: 'https://www.betano.bet.br',
    cta: 'Aposte agora',
  },
  {
    name: 'Bet365',
    description: 'Líder mundial em apostas',
    url: 'https://www.bet365.com',
    cta: 'Saiba mais',
  },
  {
    name: 'Amazon',
    description: 'Produtos oficiais da Copa',
    url: 'https://www.amazon.com.br/s?k=copa+do+mundo+2026',
    cta: 'Ver produtos',
  },
]

export function AffiliateBar() {
  return (
    <div className="border-t border-navy-800 bg-navy-900/50">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-slate-600 whitespace-nowrap">
            Parceiros
          </span>
          <div className="h-px flex-1 bg-navy-800 hidden sm:block" />
          <div className="flex flex-wrap justify-center gap-2">
            {AFFILIATES.map((a) => (
              <a
                key={a.name}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex items-center gap-2 px-3 py-1.5 rounded border border-navy-700 hover:border-gold-500/40 hover:bg-navy-800 transition-all duration-200"
              >
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-300 group-hover:text-gold-400 transition-colors leading-none">
                    {a.name}
                  </div>
                  <div className="text-[10px] text-slate-600 leading-none mt-0.5">
                    {a.description}
                  </div>
                </div>
                <span className="text-[10px] text-gold-500/70 group-hover:text-gold-400 transition-colors ml-1 whitespace-nowrap">
                  {a.cta} →
                </span>
              </a>
            ))}
          </div>
          <div className="h-px flex-1 bg-navy-800 hidden sm:block" />
          <span className="text-[10px] text-slate-700 whitespace-nowrap">Anuncie aqui</span>
        </div>
      </div>
    </div>
  )
}
