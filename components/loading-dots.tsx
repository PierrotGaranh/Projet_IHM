export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="animate-bounce delay-0">.</span>
      <span className="animate-bounce delay-150">.</span>
      <span className="animate-bounce delay-300">.</span>
    </span>
  );
}