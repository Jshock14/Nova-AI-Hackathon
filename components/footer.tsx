import { Icon } from "@/components/ui/icon";

export type FooterVariant = "landing" | "results" | "minimal" | "details";

export function Footer({ variant }: { variant: FooterVariant }) {
  const compact = variant === "minimal";

  return (
    <footer className={`border-t border-slate-200 bg-white px-8 ${compact ? "py-6" : "py-10"}`}>
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-3 font-bold text-primary">
          <span className="flex size-5 items-center justify-center rounded bg-primary text-white">
            <Icon name="flight_takeoff" size={11} />
          </span>
          Redirect
        </div>
        <div>© 2026 Redirect Travel Inc. All rights reserved.</div>
      </div>
    </footer>
  );
}
