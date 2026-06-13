import { Zap } from 'lucide-react'

export function History() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary">
          <Zap className="w-4 h-4" />
          <span>Notre histoire</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">La mobilité urbaine repensée</h2>
        <p className="text-muted-foreground">
          Fondé en 2025, ParkHub est né d'un constat simple : le stationnement en ville est
          chronophage, stressant et souvent inefficace. Nous avons développé une plateforme
          intelligente qui connecte les conducteurs aux places de parking disponibles en
          temps réel.
        </p>
        <p className="text-muted-foreground">
          Aujourd'hui, ParkHub c'est plus de 2 000 utilisateurs actifs et 250 places de parking
          gérées dans toute la région parisienne.
        </p>
      </div>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
        <div className="text-5xl md:text-6xl font-bold text-primary mb-2">2025</div>
        <p className="text-muted-foreground">Année de création</p>
      </div>
    </div>
  )
}