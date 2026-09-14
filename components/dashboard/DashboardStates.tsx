// components/dashboard/DashboardStates.tsx
export function LoadingState({ label = "Loading forecast…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate">
      <div className="h-6 w-6 rounded-full border-2 border-slate border-t-amber animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <p className="text-sm text-red-400 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs text-amber underline underline-offset-2">Try again</button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="flex items-center justify-center py-24 text-sm text-slate text-center px-8">{message}</div>;
}