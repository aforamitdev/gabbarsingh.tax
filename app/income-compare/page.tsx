import { IncomeCompareTabs } from "@/components/tax/IncomeCompareTabs";

export default function IncomeComparePage() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1f1d1a]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_#f4b47d,_transparent_65%)] opacity-60" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_#7dd9c5,_transparent_60%)] opacity-60" />
          <div className="absolute bottom-[-220px] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_#f7e1a3,_transparent_60%)] opacity-70" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-12 pt-8 md:px-10 lg:h-screen lg:max-h-screen lg:gap-3 lg:overflow-hidden lg:pb-3">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b6156]">
                Global comparison
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-4xl font-semibold text-[#1d1b19] md:text-5xl">
                Income Percentile
              </h1>
              <p className="mt-2 max-w-xl text-sm text-[#5f564c] md:text-base">
                Compare your income percentile across G7, SAARC, and Asian peer
                countries using World Bank income and inequality data.
              </p>
            </div>
          </header>

          <IncomeCompareTabs />
        </div>
      </div>
    </div>
  );
}
