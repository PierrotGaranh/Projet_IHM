export function Footer() {
  return (
    <footer className="border-t border-border bg-card bottom-0 w-full py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ParkHub. Tous droits réservés.</p>
      </div>
    </footer>
  );
}