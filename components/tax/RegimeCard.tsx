"use client";

import * as React from "react";
import { useAtomValue } from "jotai";
import { inr, percent } from "@/lib/format";
import type { RegimeResult } from "@/lib/tax";
import { SlabChart } from "@/components/tax/SlabChart";
import { incomeAtom } from "@/lib/tax-atoms";

export function RegimeCard({
  regime,
  printId,
}: {
  regime: {
    title: string;
    data: RegimeResult;
    tint: string;
    accent: string;
  };
  printId: string;
}) {
  const income = useAtomValue(incomeAtom);
  const [selection, setSelection] = React.useState({
    startIndex: 0,
    endIndex: Math.max(0, regime.data.breakdown.length - 1),
  });
  const selectedCumulativeTax = regime.data.breakdown
    .slice(selection.startIndex, selection.endIndex + 1)
    .reduce((sum, slab) => sum + slab.tax, 0);

  const handlePrint = () => {
    document.body.setAttribute("data-print-id", printId);
    document.body.classList.add("print-mode");

    const cleanup = () => {
      document.body.removeAttribute("data-print-id");
      document.body.classList.remove("print-mode");
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  const isSelected = (index: number) =>
    index >= selection.startIndex && index <= selection.endIndex;

  return (
    <div
      className="print-target flex h-full flex-col rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm"
      data-print-id={printId}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7a6f63]">
            {regime.title}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#1f1d1a]">
            Total tax: {inr.format(regime.data.totalTax)}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${regime.tint} ${regime.accent}`}
          >
            Effective rate {percent.format(regime.data.totalTax / Math.max(1, income))}
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-full border border-[#e5dbcf] bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#6b6156] transition hover:border-[#1f1d1a] hover:text-[#1f1d1a]"
          >
            Print
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-[#7a6f63]">
        <div className="flex items-center justify-between">
          <span>Taxable income</span>
          <span className="font-semibold text-[#1f1d1a]">
            {inr.format(regime.data.taxableIncome)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Slab tax</span>
          <span className="font-semibold text-[#1f1d1a]">
            {inr.format(regime.data.slabTax)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Rebate (Section 87A)</span>
          <span className="font-semibold text-[#1f1d1a]">
            -{inr.format(regime.data.rebate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>
            Surcharge{" "}
            {regime.data.surchargeRate > 0
              ? `(${percent.format(regime.data.surchargeRate)})`
              : ""}
          </span>
          <span className="font-semibold text-[#1f1d1a]">
            {inr.format(regime.data.surcharge)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Health & education cess (4%)</span>
          <span className="font-semibold text-[#1f1d1a]">
            {inr.format(regime.data.cess)}
          </span>
        </div>
      </div>

      {regime.data.surchargeRelief ? (
        <p className="mt-3 text-xs text-[#7a6f63]">
          Marginal relief applied to surcharge.
        </p>
      ) : null}

      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-[0.25em] text-[#7a6f63]">
          Slab-wise tax
        </p>
        <div className="mt-3 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] p-4">
          <SlabChart
            data={regime.data.breakdown}
            title="Tax paid in each slab"
            onSelectionChange={setSelection}
            
          />
        </div>
        <div className="mt-3 grid gap-2">
          {regime.data.breakdown.map((slab, index) => (
            <div
              key={slab.label}
              className={`flex items-center justify-between rounded-2xl border px-4 py-2 text-xs ${
                slab.tax === 0
                  ? "border-[#efe5da] bg-[#fbf8f4] text-[#a99f95] opacity-70"
                  : isSelected(index)
                    ? "border-[#e07a5f] bg-[#fff1e8]"
                    : "border-[#efe5da] bg-[#fbf8f4]"
              }`}
            >
              <div>
                <div className="font-semibold text-[#1f1d1a]">
                  {slab.label}
                </div>
                <div className="text-[#7a6f63]">
                  Income: {inr.format(slab.amount)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#1f1d1a]">
                  {percent.format(slab.rate)}
                </div>
                <div className="text-[#7a6f63]">
                  Tax: {inr.format(slab.tax)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between rounded-2xl border border-[#efe5da] bg-white px-4 py-2 text-xs">
          <span className="uppercase tracking-[0.2em] text-[#7a6f63]">
            Cumulative slab tax
          </span>
          <span className="font-semibold text-[#1f1d1a]">
            {inr.format(selectedCumulativeTax)}
          </span>
        </div>
      </div>
    </div>
  );
}
