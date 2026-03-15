import { LandingSearchCard } from "@/components/landing/landing-search-card";
import { TrustIndicators } from "@/components/landing/trust-indicators";
import { RecoveryPreview } from "@/components/landing/recovery-preview";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <section className="w-full px-6 pb-12 pt-16 text-center md:pt-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center">
          <span className="mb-4 rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] text-primary">
            Instant Recovery Tool
          </span>
          <h1 className="max-w-[768px] text-[44px] font-black leading-[1.05] tracking-[-0.03em] text-[#0f172a] md:text-[60px]">
            Flight delayed or canceled? <span className="text-[#6f829f]">We&apos;ll find your best alternative in seconds.</span>
          </h1>
          <p className="mb-12 mt-6 max-w-[672px] text-xl leading-8 text-slate-500">
            Get back on track without the stress. We search thousands of routes to find you the
            fastest way home.
          </p>

          <LandingSearchCard />
          <TrustIndicators />
        </div>
      </section>

      <RecoveryPreview />
    </main>
  );
}
