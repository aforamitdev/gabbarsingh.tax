"use client";

import * as React from "react";
import * as echarts from "echarts";
import { useAtom, useAtomValue } from "jotai";
import { incomeAtom, newDeductionsAtom, oldDeductionsAtom } from "@/lib/tax-atoms";
import { inr, intlDollar } from "@/lib/format";
import { Input } from "@/components/ui/input";

const tabs = [
  { id: "g7", label: "G7" },
  { id: "saarc", label: "SAARC" },
  { id: "asia", label: "Asia" },
] as const;

type CountryData = {
  code: string;
  name: string;
  gni: number | null;
  gniYear: number | null;
  gini: number | null;
  giniYear: number | null;
  percentile: number | null;
};

type ApiResponse = {
  userIncome: number;
  userIncomePpp: number | null;
  pppYear: number | null;
  groups: Record<string, { label: string; countries: CountryData[] }>;
};

function useIncomeCompareData(income: number) {
  const [data, setData] = React.useState<ApiResponse | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const timeout = setTimeout(async () => {
      setStatus("loading");
      try {
        const response = await fetch(`/api/income-compare?income=${income}`);
        if (!response.ok) {
          throw new Error("Unable to fetch income comparison data");
        }
        const json = (await response.json()) as ApiResponse;
        if (active) {
          setData(json);
          setStatus("idle");
        }
      } catch (error) {
        if (active) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [income]);

  return { data, status, errorMessage };
}

function IncomeCompareChart({ countries }: { countries: CountryData[] }) {
  const chartRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const sorted = [...countries].sort(
      (a, b) => (b.percentile ?? 0) - (a.percentile ?? 0)
    );

    chart.setOption({
      grid: { left: 12, right: 12, bottom: 24, top: 12, containLabel: true },
      tooltip: {
        trigger: "item",
        formatter: (params: { dataIndex: number }) => {
          const item = sorted[params.dataIndex];
          const percentile = item.percentile
            ? `${item.percentile.toFixed(1)}%`
            : "No data";
          return `${item.name}<br/>Percentile: ${percentile}`;
        },
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { color: "#7a6f63", fontSize: 10, formatter: "{value}%" },
        splitLine: { lineStyle: { color: "#efe5da" } },
      },
      yAxis: {
        type: "category",
        data: sorted.map((item) => item.name),
        axisLabel: { color: "#7a6f63", fontSize: 10 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#e5dbcf" } },
      },
      series: [
        {
          type: "bar",
          data: sorted.map((item) => item.percentile ?? 0),
          barWidth: "50%",
          itemStyle: {
            color: (params: { dataIndex: number }) =>
              params.dataIndex % 2 === 0 ? "#7dd9c5" : "#f4b47d",
            borderRadius: [8, 8, 8, 8],
          },
          label: {
            show: true,
            position: "right",
            formatter: (params: { value: number }) =>
              params.value ? `${params.value.toFixed(1)}%` : "N/A",
            color: "#1f1d1a",
            fontSize: 10,
          },
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [countries]);

  return <div ref={chartRef} className="h-72 w-full" />;
}

export function IncomeCompareTabs() {
  const [income, setIncome] = useAtom(incomeAtom);
  const [oldDeductions, setOldDeductions] = useAtom(oldDeductionsAtom);
  const [newDeductions, setNewDeductions] = useAtom(newDeductionsAtom);
  const [activeTab, setActiveTab] = React.useState<(typeof tabs)[number]["id"]>("g7");
  const { data, status, errorMessage } = useIncomeCompareData(income);

  const group = data?.groups?.[activeTab];
  const countries = group?.countries ?? [];

  return (
    <section className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7a6f63]">
            Global comparison
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#1f1d1a]">
            Income percentile vs peers
          </h2>
          <p className="mt-1 text-xs text-[#7a6f63]">
            Based on GNI per capita (PPP) and Gini estimates.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                activeTab === tab.id
                  ? "border-[#1f1d1a] bg-[#1f1d1a] text-white"
                  : "border-[#e5dbcf] bg-white text-[#6b6156]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7a6f63]">
          <span>Annual income input: {inr.format(income)}</span>
          <span>
            PPP conversion: {data?.userIncomePpp ? intlDollar.format(data.userIncomePpp) : "N/A"}
            {data?.pppYear ? ` (India PPP ${data.pppYear})` : ""}
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-[10px] uppercase tracking-[0.2em] text-[#7a6f63]">
            Annual income (₹)
            <Input
              type="number"
              min={0}
              step={10000}
              value={income}
              onChange={(event) => setIncome(Number(event.target.value || 0))}
              className="h-9 rounded-xl border-[#e7ddd0] bg-white text-sm"
            />
          </label>
          <label className="grid gap-1 text-[10px] uppercase tracking-[0.2em] text-[#7a6f63]">
            Old regime deductions (₹)
            <Input
              type="number"
              min={0}
              step={5000}
              value={oldDeductions}
              onChange={(event) => setOldDeductions(Number(event.target.value || 0))}
              className="h-9 rounded-xl border-[#e7ddd0] bg-white text-sm"
            />
          </label>
          <label className="grid gap-1 text-[10px] uppercase tracking-[0.2em] text-[#7a6f63]">
            New regime deductions (₹)
            <Input
              type="number"
              min={0}
              step={5000}
              value={newDeductions}
              onChange={(event) => setNewDeductions(Number(event.target.value || 0))}
              className="h-9 rounded-xl border-[#e7ddd0] bg-white text-sm"
            />
          </label>
        </div>
      </div>

      <div className="mt-4">
        {status === "loading" && (
          <div className="text-sm text-[#7a6f63]">Loading comparison data…</div>
        )}
        {status === "error" && (
          <div className="text-sm text-[#a3572c]">{errorMessage}</div>
        )}
        {status === "idle" && group ? (
          <IncomeCompareChart countries={countries} />
        ) : null}
      </div>

      {status === "idle" && group ? (
        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          {countries.map((item) => (
            <div
              key={item.code}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] px-4 py-2 text-xs"
            >
              <div className="font-semibold text-[#1f1d1a]">{item.name}</div>
              <div className="text-[#7a6f63]">
                GNI PPP: {item.gni ? intlDollar.format(item.gni) : "N/A"}
                {item.gniYear ? ` (${item.gniYear})` : ""}
              </div>
              <div className="text-[#7a6f63]">
                Gini: {item.gini ? item.gini.toFixed(1) : "N/A"}
                {item.giniYear ? ` (${item.giniYear})` : ""}
              </div>
              <div className="font-semibold text-[#1f1d1a]">
                Percentile: {item.percentile ? `${item.percentile.toFixed(1)}%` : "N/A"}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-xs text-[#7a6f63]">
        Percentiles are estimated with a lognormal distribution using the latest
        available Gini and GNI per capita (PPP) from the World Bank.
      </p>
    </section>
  );
}
