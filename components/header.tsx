"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export type HeaderVariant = "landing" | "run" | "results" | "details";

function Logo({ icon = "flight_takeoff" }: { icon?: "flight_takeoff" | "directions_run" }) {
  return (
    <Link href="/" className="flex items-center gap-3 text-primary dark:text-slate-100">
      <div className="size-6 flex items-center justify-center bg-primary text-white rounded-lg">
        <Icon name={icon} className="text-sm" />
      </div>
      <h2 className="text-xl font-bold leading-tight tracking-tight">Redirect</h2>
    </Link>
  );
}

export function Header({ variant }: { variant: HeaderVariant }) {
  const pathname = usePathname();
  const isDetails = pathname?.startsWith("/results/") && pathname !== "/results";

  const resolvedVariant = isDetails ? "details" : variant;

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-10 lg:px-20 py-4 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <Logo icon={resolvedVariant === "results" ? "directions_run" : "flight_takeoff"} />

      <div className="flex flex-1 justify-end gap-8 items-center">
        {resolvedVariant === "landing" && (
          <>
            <nav className="hidden md:flex items-center gap-9">
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
              >
                My Trips
              </Link>
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
              >
                Log In
              </Link>
            </nav>
            <Link
              href="#"
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              Sign Up
            </Link>
          </>
        )}

        {resolvedVariant === "run" && (
          <>
            <nav className="flex items-center gap-8">
              <Link
                href="/"
                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent text-sm font-medium transition-colors"
              >
                My Trip
              </Link>
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-accent text-sm font-medium transition-colors"
              >
                Support
              </Link>
            </nav>
            <div className="h-10 w-10 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              <Icon name="person" className="text-slate-500" />
            </div>
          </>
        )}

        {resolvedVariant === "results" && (
          <>
            <div className="hidden md:flex items-center min-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-10 bg-slate-100 dark:bg-slate-800">
                <span className="flex items-center justify-center pl-4 text-text-secondary">
                  <Icon name="search" />
                </span>
                <input
                  type="search"
                  className="w-full border-none bg-transparent focus:ring-0 text-text-primary dark:text-slate-100 placeholder:text-text-secondary text-sm px-2"
                  placeholder="Search (e.g. Flight 104)"
                />
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors text-slate-600 dark:text-slate-400"
              >
                My Trips
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors text-slate-600 dark:text-slate-400"
              >
                Support
              </Link>
            </nav>
            <Link
              href="#"
              className="bg-primary text-white text-sm font-bold h-10 px-6 rounded-lg hover:bg-primary/90 transition-all inline-flex items-center justify-center"
            >
              Sign Up
            </Link>
            <div className="relative">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full size-10 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                <Icon name="person" className="text-slate-500" />
              </div>
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" aria-hidden />
            </div>
          </>
        )}

        {resolvedVariant === "details" && (
          <>
            <div className="hidden md:flex items-center min-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-10 bg-slate-100 dark:bg-slate-800">
                <span className="flex items-center justify-center pl-4 text-text-secondary">
                  <Icon name="search" />
                </span>
                <input
                  type="search"
                  className="w-full border-none bg-transparent focus:ring-0 text-text-primary dark:text-slate-100 placeholder:text-text-secondary text-sm px-2"
                  placeholder="Search (e.g. Flight 104)"
                />
              </div>
            </div>
            <nav className="flex items-center gap-9">
              <Link
                href="/results"
                className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
              >
                My Trips
              </Link>
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
              >
                Support
              </Link>
              <Link
                href="#"
                className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
              >
                Help
              </Link>
            </nav>
            <Link
              href="#"
              className="bg-primary text-white text-sm font-bold h-10 px-6 rounded-lg hover:bg-primary/90 transition-all inline-flex items-center justify-center"
            >
              Sign Up
            </Link>
            <div className="relative">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full size-10 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                <Icon name="person" className="text-slate-500" />
              </div>
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" aria-hidden />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
