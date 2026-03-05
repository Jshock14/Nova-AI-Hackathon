import Link from "next/link";

export type FooterVariant = "landing" | "results" | "minimal" | "details";

export function Footer({ variant }: { variant: FooterVariant }) {
  if (variant === "minimal") {
    return (
      <footer className="p-8 text-center text-slate-500 text-sm">
        <p>© Redirect 2026</p>
      </footer>
    );
  }

  if (variant === "details") {
    return (
      <footer className="mt-auto py-8 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">© Redirect 2026</p>
          <div className="flex gap-8 text-slate-500 text-sm">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === "results") {
    return (
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-6 lg:px-20 mt-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">© Redirect 2026</p>
          <div className="flex gap-8 text-slate-500 text-sm">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  // landing
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-8 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-sm">© Redirect 2026</p>
        <div className="flex gap-8 text-slate-500 text-sm">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
