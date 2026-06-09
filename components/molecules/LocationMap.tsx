'use client';

interface LocationMapProps {
  lat: number;
  lng: number;
  address: string;
}

export function LocationMap({ lat, lng, address }: LocationMapProps) {
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Localisation</p>
      <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Carte de localisation"
        />
      </div>
      <p className="text-xs text-muted-foreground">{address}</p>
    </div>
  );
}