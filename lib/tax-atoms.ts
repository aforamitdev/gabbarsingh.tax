import { atom } from "jotai";
import { computeRegime, NEW_SLABS, OLD_SLABS } from "@/lib/tax";

export const incomeAtom = atom(1250000);
export const oldDeductionsAtom = atom(150000);
export const newDeductionsAtom = atom(0);

export const taxableOldAtom = atom((get) =>
  Math.max(0, get(incomeAtom) - get(oldDeductionsAtom))
);
export const taxableNewAtom = atom((get) =>
  Math.max(0, get(incomeAtom) - get(newDeductionsAtom))
);

export const oldRegimeAtom = atom((get) =>
  computeRegime(get(taxableOldAtom), OLD_SLABS, 500000, 12500, false, "old")
);
export const newRegimeAtom = atom((get) =>
  computeRegime(get(taxableNewAtom), NEW_SLABS, 1200000, 60000, true, "new")
);

export const savingsAtom = atom(
  (get) => get(oldRegimeAtom).totalTax - get(newRegimeAtom).totalTax
);

export const lowerRegimeAtom = atom((get) => {
  const savings = get(savingsAtom);
  if (savings > 0) return "New Regime";
  if (savings < 0) return "Old Regime";
  return "Tie";
});

export const monthlyIncomeAtom = atom((get) => get(incomeAtom) / 12);
