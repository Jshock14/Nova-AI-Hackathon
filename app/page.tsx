import { LandingSearchCard } from "@/components/landing/landing-search-card";
import { TrustIndicators } from "@/components/landing/trust-indicators";
import { RecoveryPreview } from "@/components/landing/recovery-preview";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center">
      <section className="w-full max-w-[1200px] px-6 py-12 md:py-20 text-center flex flex-col items-center">
        <h1 className="text-slate-800 dark:text-white text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6 max-w-3xl">
          Flight delayed or canceled? We&apos;ll find your best alternative in seconds.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mb-12">
          Don&apos;t let a bad airline ruin your plans. We search thousands of alternatives to find
          you the next best route home.
        </p>

        <LandingSearchCard />

        <TrustIndicators />
      </section>

      <RecoveryPreview />
    </main>
  );
}
