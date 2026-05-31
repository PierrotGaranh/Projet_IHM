interface PeakHoursChartProps {
  data: { time: string; count: number }[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const hasData = data.some(h => h.count > 0);
  if (!hasData) return <p className="text-sm text-muted-foreground text-center py-4">Aucune réservation enregistrée</p>;
  const maxCount = Math.max(...data.map(h => h.count));
  return (
    <div className="flex items-end gap-2 pt-4 overflow-x-auto pb-2">
      {data.filter(item => item.count > 0).sort((a, b) => a.time.localeCompare(b.time)).map((item) => {
        const heightPercent = maxCount === 0 ? 0 : (item.count / maxCount) * 100;
        const barHeight = Math.max(24, (heightPercent / 100) * 200);
        return (
          <div key={item.time} className="flex flex-col items-center flex-shrink-0 w-14">
            <div className="relative w-full flex flex-col items-center">
              <div className="w-1 bg-accent rounded-full transition-all duration-300 hover:bg-accent/80" style={{ height: `${barHeight}px` }} />
              <span className="text-xs font-semibold text-foreground mt-2">{item.count}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{item.time}</span>
          </div>
        );
      })}
    </div>
  );
}