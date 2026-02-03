export type Slab = {
  upto: number | null;
  rate: number;
  label: string;
};

export const NEW_SLABS: Slab[] = [
  { upto: 400000, rate: 0, label: "Up to ₹4,00,000" },
  { upto: 800000, rate: 0.05, label: "₹4,00,001 to ₹8,00,000" },
  { upto: 1200000, rate: 0.1, label: "₹8,00,001 to ₹12,00,000" },
  { upto: 1600000, rate: 0.15, label: "₹12,00,001 to ₹16,00,000" },
  { upto: 2000000, rate: 0.2, label: "₹16,00,001 to ₹20,00,000" },
  { upto: 2400000, rate: 0.25, label: "₹20,00,001 to ₹24,00,000" },
  { upto: null, rate: 0.3, label: "Above ₹24,00,000" },
];

export const OLD_SLABS: Slab[] = [
  { upto: 250000, rate: 0, label: "Up to ₹2,50,000" },
  { upto: 500000, rate: 0.05, label: "₹2,50,001 to ₹5,00,000" },
  { upto: 1000000, rate: 0.2, label: "₹5,00,001 to ₹10,00,000" },
  { upto: null, rate: 0.3, label: "Above ₹10,00,000" },
];

export type SlabBreakdown = {
  label: string;
  amount: number;
  rate: number;
  tax: number;
};

export function buildSlabBreakdown(
  taxableIncome: number,
  slabs: Slab[]
): SlabBreakdown[] {
  let remaining = Math.max(0, taxableIncome);
  let lower = 0;

  return slabs.map((slab) => {
    const upper = slab.upto ?? Number.POSITIVE_INFINITY;
    const amount = Math.max(0, Math.min(upper - lower, remaining));
    const tax = amount * slab.rate;
    remaining -= amount;
    lower = upper;

    return {
      label: slab.label,
      amount,
      rate: slab.rate,
      tax,
    };
  });
}

export type BaseTax = {
  slabTax: number;
  rebate: number;
  taxAfterRebate: number;
  breakdown: SlabBreakdown[];
};

export function computeBaseTax(
  taxableIncome: number,
  slabs: Slab[],
  rebateThreshold: number,
  rebateCap: number,
  rebateMarginalRelief: boolean
): BaseTax {
  const breakdown = buildSlabBreakdown(taxableIncome, slabs);
  const slabTax = breakdown.reduce((sum, slab) => sum + slab.tax, 0);
  let rebate = 0;

  if (taxableIncome <= rebateThreshold) {
    rebate = Math.min(slabTax, rebateCap);
  } else if (rebateMarginalRelief) {
    const maxTax = taxableIncome - rebateThreshold;
    if (slabTax > maxTax) {
      rebate = slabTax - maxTax;
    }
  }

  return {
    slabTax,
    rebate,
    taxAfterRebate: Math.max(0, slabTax - rebate),
    breakdown,
  };
}

export type SurchargeResult = {
  surchargeRate: number;
  surcharge: number;
  marginalReliefApplied: boolean;
};

export function getSurchargeRate(
  taxableIncome: number,
  regime: "old" | "new"
): number {
  if (taxableIncome > 50000000) return regime === "new" ? 0.25 : 0.37;
  if (taxableIncome > 20000000) return 0.25;
  if (taxableIncome > 10000000) return 0.15;
  if (taxableIncome > 5000000) return 0.1;
  return 0;
}

export function applySurcharge(
  taxableIncome: number,
  taxAfterRebate: number,
  computeTaxAt: (income: number) => BaseTax,
  regime: "old" | "new"
): SurchargeResult {
  const surchargeRate = getSurchargeRate(taxableIncome, regime);
  if (surchargeRate === 0) {
    return { surchargeRate, surcharge: 0, marginalReliefApplied: false };
  }

  const threshold =
    taxableIncome > 50000000
      ? 50000000
      : taxableIncome > 20000000
        ? 20000000
        : taxableIncome > 10000000
          ? 10000000
          : 5000000;

  const taxAtThreshold = computeTaxAt(threshold).taxAfterRebate;
  const maxPayable = taxAtThreshold + (taxableIncome - threshold);
  const baseSurcharge = taxAfterRebate * surchargeRate;
  const totalWithSurcharge = taxAfterRebate + baseSurcharge;

  if (totalWithSurcharge > maxPayable) {
    return {
      surchargeRate,
      surcharge: Math.max(0, maxPayable - taxAfterRebate),
      marginalReliefApplied: true,
    };
  }

  return { surchargeRate, surcharge: baseSurcharge, marginalReliefApplied: false };
}

export type RegimeResult = {
  taxableIncome: number;
  slabTax: number;
  rebate: number;
  surcharge: number;
  surchargeRate: number;
  surchargeRelief: boolean;
  cess: number;
  totalTax: number;
  breakdown: SlabBreakdown[];
};

export function computeRegime(
  taxableIncome: number,
  slabs: Slab[],
  rebateThreshold: number,
  rebateCap: number,
  rebateMarginalRelief: boolean,
  regime: "old" | "new"
): RegimeResult {
  const computeTaxAt = (income: number) =>
    computeBaseTax(income, slabs, rebateThreshold, rebateCap, rebateMarginalRelief);

  const baseTax = computeTaxAt(taxableIncome);
  const surchargeResult = applySurcharge(
    taxableIncome,
    baseTax.taxAfterRebate,
    computeTaxAt,
    regime
  );
  const cess = (baseTax.taxAfterRebate + surchargeResult.surcharge) * 0.04;
  const totalTax = baseTax.taxAfterRebate + surchargeResult.surcharge + cess;
  return {
    taxableIncome,
    slabTax: baseTax.slabTax,
    rebate: baseTax.rebate,
    surcharge: surchargeResult.surcharge,
    surchargeRate: surchargeResult.surchargeRate,
    surchargeRelief: surchargeResult.marginalReliefApplied,
    cess,
    totalTax,
    breakdown: baseTax.breakdown,
  };
}

export const INCOME_PERCENTILES = [
  { percentile: 10, monthlyIncome: 3900 },
  { percentile: 50, monthlyIncome: 12000 },
  { percentile: 90, monthlyIncome: 32000 },
  { percentile: 99, monthlyIncome: 75000 },
];

export function estimatePercentile(monthlyIncome: number) {
  const points = INCOME_PERCENTILES;
  if (monthlyIncome <= points[0].monthlyIncome) {
    return { percentile: 10, label: "Below 10th percentile" };
  }
  if (monthlyIncome >= points[points.length - 1].monthlyIncome) {
    return { percentile: 99, label: "Above 99th percentile" };
  }

  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    if (
      monthlyIncome >= current.monthlyIncome &&
      monthlyIncome <= next.monthlyIncome
    ) {
      const ratio =
        (monthlyIncome - current.monthlyIncome) /
        (next.monthlyIncome - current.monthlyIncome);
      const percentile =
        current.percentile + ratio * (next.percentile - current.percentile);
      return {
        percentile,
        label: `Around ${percentile.toFixed(1)}th percentile`,
      };
    }
  }

  return { percentile: 50, label: "Around median" };
}
