import { AlertTriangle, CloudOff, SearchX } from "lucide-react";
import { GlassCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-56 rounded-xl2 border border-white/10 bg-white/[0.04]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl2 border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
      <div className="h-40 rounded-xl2 border border-white/10 bg-white/[0.04]" />
      <div className="h-64 rounded-xl2 border border-white/10 bg-white/[0.04]" />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
      <AlertTriangle className="h-8 w-8 text-amber" aria-hidden="true" />
      <p className="text-sm text-slate">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </GlassCard>
  );
}

export function OfflineState() {
  return (
    <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
      <CloudOff className="h-8 w-8 text-slate" aria-hidden="true" />
      <p className="text-sm text-slate">You&apos;re offline. Reconnect to refresh weather data.</p>
    </GlassCard>
  );
}

export function EmptyLocationState() {
  return (
    <GlassCard className="flex flex-col items-center gap-3 p-14 text-center">
      <SearchX className="h-8 w-8 text-slate" aria-hidden="true" />
      <p className="font-display text-lg text-cloud">Search for a city to get started</p>
      <p className="max-w-sm text-sm text-slate">
        Use the search bar above, or tap &quot;Locate me&quot; to use your current location.
      </p>
    </GlassCard>
  );
}
