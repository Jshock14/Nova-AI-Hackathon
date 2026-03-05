import Link from "next/link";

export function HeaderNavigation() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Redirect
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Flight disruption assistant
          </span>
        </Link>
        <div className="text-xs text-muted-foreground">
          Beta · Does not book on your behalf
        </div>
      </div>
    </header>
  );
}

