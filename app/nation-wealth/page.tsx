import data from "@/data/nation-wealth.json";
import { NationWealthTabs } from "@/components/tax/NationWealthTabs";

export default function NationWealthPage() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1f1d1a]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_#f4b47d,_transparent_65%)] opacity-60" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_#7dd9c5,_transparent_60%)] opacity-60" />
          <div className="absolute bottom-[-220px] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_#f7e1a3,_transparent_60%)] opacity-70" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-12 pt-8 md:px-10">
          <header className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6b6156]">
              Nation wealth
            </p>
            
            <h1 className="mt-1 font-[var(--font-display)] text-4xl font-semibold text-[#1d1b19] md:text-5xl">
              India & Global Wealth
            </h1>
                  <span className="inline-flex w-fit items-center rounded-full border border-[#f4b47d] bg-[#fff1e8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a3572c]">
              Under Construction
            </span>
            <p className="mt-2 max-w-2xl text-sm text-[#5f564c] md:text-base">
              Compare India`s net financial assets with G7, G20, SAARC, and Asian
              peers using Allianz Global Wealth Report 2023 data.
            </p>
          </header>

          <NationWealthTabs groups={data.groups} />
        </div>
      </div>
    </div>
  );
}
