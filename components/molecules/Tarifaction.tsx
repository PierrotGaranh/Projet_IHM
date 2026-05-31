export function Tarifaction() {
  return (
    <div className="pt-6 border-t border-border space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Tarification (à titre informatif)
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between py-3 border-b border-border">
          <span className="text-muted-foreground">Place Compact</span>
          <span className="font-semibold">2€/heure</span>
        </div>
        <div className="flex justify-between py-3 border-b border-border">
          <span className="text-muted-foreground">Place Standard</span>
          <span className="font-semibold">3€/heure</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-muted-foreground">Place Premium</span>
          <span className="font-semibold">5€/heure</span>
        </div>
      </div>
    </div>
  )
}