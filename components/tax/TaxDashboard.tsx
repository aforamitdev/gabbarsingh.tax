"use client";

import { useAtomValue } from "jotai";
import { TaxInputs } from "@/components/tax/TaxInputs";
import { RegimeCard } from "@/components/tax/RegimeCard";
import { IncomePercentileCard } from "@/components/tax/IncomePercentileCard";
import { inr } from "@/lib/format";
import { lowerRegimeAtom, newRegimeAtom, oldRegimeAtom, savingsAtom } from "@/lib/tax-atoms";

export function TaxDashboard() {
  const oldRegime = useAtomValue(oldRegimeAtom);
  const newRegime = useAtomValue(newRegimeAtom);
  const savings = useAtomValue(savingsAtom);
  const lowerRegime = useAtomValue(lowerRegimeAtom);

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1f1d1a]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_#f4b47d,_transparent_65%)] opacity-60" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_#7dd9c5,_transparent_60%)] opacity-60" />
          <div className="absolute bottom-[-220px] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_#f7e1a3,_transparent_60%)] opacity-70" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-12 pt-8 md:px-10">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b6156]">
                Dashboard
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-4xl font-semibold text-[#1d1b19] md:text-5xl">
                India Tax Studio
              </h1>
              <p className="mt-2 max-w-xl text-sm text-[#5f564c] md:text-base">
                Compare the FY 2025-26 (AY 2026-27) old and new regimes with a
                full slab-by-slab tax split.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border border-[#e5dbcf] bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6b6156] transition hover:border-[#1f1d1a] hover:text-[#1f1d1a]"
              >
                Print
              </button>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <TaxInputs />
            <IncomePercentileCard />
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
            <div className="text-xs uppercase tracking-[0.2em] text-[#7a6f63]">
              Best result
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1f1d1a]">
                {lowerRegime}
              </span>
              <span className="text-sm font-semibold text-[#1f1d1a]">
                {savings === 0
                  ? "No difference"
                  : `${savings > 0 ? "Save" : "Costs"} ${inr.format(Math.abs(savings))}`}
              </span>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <RegimeCard
              regime={{
                title: "New Regime (FY 2025-26)",
                data: newRegime,
                tint: "bg-[#eaf6f2]",
                accent: "text-[#2f7f6a]",
              }}
              printId="new-regime"
            />
            <RegimeCard
              regime={{
                title: "Old Regime (FY 2025-26)",
                data: oldRegime,
                tint: "bg-[#fff3e6]",
                accent: "text-[#a3572c]",
              }}
              printId="old-regime"
            />
          </section>

          <p className="text-xs text-[#7a6f63]">
            Assumes resident individual under 60 with only normal income (no
            special-rate capital gains). Includes surcharge and 4% cess.
          </p>
        </div>
      </div>
    </div>
  );
}
