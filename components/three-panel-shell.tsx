import { ReactNode } from "react";
import { SearchForm } from "@/components/search-form";
import { PreferencesPanel } from "@/components/preferences-panel";
import { SelectedFlightDetails } from "@/components/selected-flight-details";

interface ThreePanelShellProps {
  children: ReactNode;
}

export function ThreePanelShell({ children }: ThreePanelShellProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl gap-4 px-4 py-4">
      {/* Left sidebar: search + preferences */}
      <aside className="hidden w-80 flex-shrink-0 flex-col gap-4 rounded-xl border border-border bg-card/80 p-4 shadow-sm lg:flex">
        <SearchForm />
        <PreferencesPanel />
      </aside>

      {/* Center panel: main content (progress / results / intro) */}
      <section className="flex min-h-full flex-1 flex-col rounded-xl border border-border bg-card/80 p-4 shadow-sm">
        {children}
      </section>

      {/* Right panel: selected flight details */}
      <aside className="hidden w-80 flex-shrink-0 rounded-xl border border-border bg-card/80 p-4 shadow-sm xl:block">
        <SelectedFlightDetails />
      </aside>
    </div>
  );
}

