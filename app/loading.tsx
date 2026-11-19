export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ai-bg">
      <div className="font-mono text-sm text-ai-muted">
        <span className="text-ai-accent-soft">$</span> loading
        <span className="ml-1 inline-block h-4 w-2 translate-y-[3px] animate-blink bg-ai-accent-soft" />
      </div>
    </div>
  );
}
