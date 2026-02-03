import { NextResponse } from "next/server";

const GROUPS = {
  g7: {
    label: "G7",
    countries: {
      USA: "United States",
      CAN: "Canada",
      GBR: "United Kingdom",
      FRA: "France",
      DEU: "Germany",
      ITA: "Italy",
      JPN: "Japan",
    },
  },
  saarc: {
    label: "SAARC",
    countries: {
      AFG: "Afghanistan",
      BGD: "Bangladesh",
      BTN: "Bhutan",
      IND: "India",
      MDV: "Maldives",
      NPL: "Nepal",
      PAK: "Pakistan",
      LKA: "Sri Lanka",
    },
  },
  asia: {
    label: "Asia (major economies)",
    countries: {
      CHN: "China",
      IND: "India",
      JPN: "Japan",
      KOR: "South Korea",
      IDN: "Indonesia",
      SAU: "Saudi Arabia",
      TUR: "Turkey",
      IRN: "Iran",
      ARE: "United Arab Emirates",
      THA: "Thailand",
      MYS: "Malaysia",
      VNM: "Vietnam",
      PHL: "Philippines",
      PAK: "Pakistan",
      BGD: "Bangladesh",
      SGP: "Singapore",
    },
  },
} as const;

const INDICATORS = {
  gni: "NY.GNP.PCAP.PP.CD",
  gini: "SI.POV.GINI",
  ppp: "PA.NUS.PPP",
} as const;

type IndicatorResult = {
  value: number | null;
  year: number | null;
};

type IndicatorMap = Record<string, IndicatorResult>;

function indicatorUrl(codes: string, indicator: string) {
  return `https://api.worldbank.org/v2/country/${codes}/indicator/${indicator}?format=json&per_page=20000&mrnev=1`;
}

async function fetchIndicator(codes: string, indicator: string) {
  const response = await fetch(indicatorUrl(codes, indicator), {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`World Bank API error: ${indicator}`);
  }

  const json = (await response.json()) as unknown;
  if (!Array.isArray(json) || !Array.isArray(json[1])) {
    throw new Error(`Unexpected API payload for ${indicator}`);
  }

  const data = json[1] as Array<{
    countryiso3code: string;
    value: number | null;
    date: string;
  }>;
  const map: IndicatorMap = {};
  for (const entry of data) {
    if (!entry || !entry.countryiso3code) continue;
    if (!map[entry.countryiso3code]) {
      map[entry.countryiso3code] = {
        value: entry.value ?? null,
        year: entry.date ? Number(entry.date) : null,
      };
    }
  }

  return map;
}

function normCdf(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let prob =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
}

function invNorm(p: number) {
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.38357751867269e2,
    -3.066479806614716e1,
    2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416,
  ];

  if (p <= 0 || p >= 1) return 0;
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q = 0;
  let r = 0;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  q = p - 0.5;
  r = q * q;
  return (
    (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

function percentileFromGini(meanIncome: number, gini: number, income: number) {
  if (meanIncome <= 0 || income <= 0) return null;
  const g = gini / 100;
  if (g <= 0 || g >= 1) return null;
  const sigma = Math.SQRT2 * invNorm((g + 1) / 2);
  if (!Number.isFinite(sigma) || sigma <= 0) return null;
  const mu = Math.log(meanIncome) - (sigma * sigma) / 2;
  const z = (Math.log(income) - mu) / sigma;
  return Math.min(100, Math.max(0, normCdf(z) * 100));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const income = Number(searchParams.get("income") ?? "0");

  const allCodes = Array.from(
    new Set(
      Object.values(GROUPS).flatMap((group) => Object.keys(group.countries))
    )
  );

  const codesParam = allCodes.join(";");

  const [gniMap, giniMap, pppMap] = await Promise.all([
    fetchIndicator(codesParam, INDICATORS.gni),
    fetchIndicator(codesParam, INDICATORS.gini),
    fetchIndicator("IND", INDICATORS.ppp),
  ]);

  const indiaPpp = pppMap.IND?.value ?? null;
  const pppYear = pppMap.IND?.year ?? null;
  const incomePpp = indiaPpp && indiaPpp > 0 ? income / indiaPpp : null;

  const groups = Object.fromEntries(
    Object.entries(GROUPS).map(([key, group]) => {
      const countries = Object.entries(group.countries).map(([code, name]) => {
        const gni = gniMap[code]?.value ?? null;
        const gniYear = gniMap[code]?.year ?? null;
        const gini = giniMap[code]?.value ?? null;
        const giniYear = giniMap[code]?.year ?? null;
        const percentile =
          incomePpp && gni && gini
            ? percentileFromGini(gni, gini, incomePpp)
            : null;
        return {
          code,
          name,
          gni,
          gniYear,
          gini,
          giniYear,
          percentile,
        };
      });

      return [key, { label: group.label, countries }];
    })
  );

  return NextResponse.json({
    userIncome: income,
    userIncomePpp: incomePpp,
    pppYear,
    groups,
  });
}
