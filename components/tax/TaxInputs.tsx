"use client";

import { useAtom } from "jotai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  incomeAtom,
  newDeductionsAtom,
  oldDeductionsAtom,
} from "@/lib/tax-atoms";
import { inr } from "@/lib/format";

export function TaxInputs() {
  const [income, setIncome] = useAtom(incomeAtom);
  const [oldDeductions, setOldDeductions] = useAtom(oldDeductionsAtom);
  const [newDeductions, setNewDeductions] = useAtom(newDeductionsAtom);

  return (
    <div className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7a6f63]">
            India tax calculator
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#1f1d1a]">
            Slab-wise estimate
          </h2>
        </div>
        <Button
          variant="outline"
          className="h-8 rounded-full border-[#e5dbcf] text-xs"
          onClick={() => {
            setIncome(1250000);
            setOldDeductions(150000);
            setNewDeductions(0);
          }}
        >
          Reset
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[#7a6f63]">
          Annual income (₹)
          <Input
            type="number"
            min={0}
            step={10000}
            value={income}
            onChange={(event) => setIncome(Number(event.target.value || 0))}
            className="h-10 rounded-xl border-[#e7ddd0] bg-white text-sm"
          />
        </label>
        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[#7a6f63]">
          Old regime deductions (₹)
          <Input
            type="number"
            min={0}
            step={5000}
            value={oldDeductions}
            onChange={(event) => setOldDeductions(Number(event.target.value || 0))}
            className="h-10 rounded-xl border-[#e7ddd0] bg-white text-sm"
          />
        </label>
        <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[#7a6f63]">
          New regime eligible deductions (₹)
          <Input
            type="number"
            min={0}
            step={5000}
            value={newDeductions}
            onChange={(event) => setNewDeductions(Number(event.target.value || 0))}
            className="h-10 rounded-xl border-[#e7ddd0] bg-white text-sm"
          />
        </label>
        <p className="text-xs text-[#7a6f63]">
          Enter only deductions allowed under each regime (e.g. standard
          deduction or eligible employer NPS under new regime).
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-[#7a6f63]">
          Current input
        </div>
        <div className="mt-2 text-sm font-semibold text-[#1f1d1a]">
          Annual income: {inr.format(income)}
        </div>
      </div>
    </div>
  );
}
