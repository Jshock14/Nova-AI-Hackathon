"use client";

import { usePathname } from "next/navigation";
import { Header, type HeaderVariant } from "@/components/header";
import { Footer, type FooterVariant } from "@/components/footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const headerVariant: HeaderVariant = pathname === "/" ? "landing" : pathname === "/run" ? "run" : pathname.startsWith("/results") ? "results" : "details";

  const showFooter = pathname === "/" || pathname === "/run" || pathname === "/results" || pathname.startsWith("/results/");
  const footerVariant: FooterVariant = pathname === "/" ? "landing" : pathname === "/run" ? "minimal" : pathname === "/results" ? "results" : "details";

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant={headerVariant} />
      <main className="flex-1 flex flex-col">{children}</main>
      {showFooter && <Footer variant={footerVariant} />}
    </div>
  );
}
