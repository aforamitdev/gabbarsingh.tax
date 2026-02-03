"use client";

import * as React from "react";
import * as echarts from "echarts";
import { intlDollar } from "@/lib/format";
import { BigNumberExplainer } from "@/components/scale/BigNumberExplainer";

export type WealthCountry = {
  country: string;
  net_financial_assets_eur_bn: number | null;
  net_financial_assets_per_capita_eur: number | null;
  data_available: boolean;
};

export type WealthGroup = {
  label: string;
  countries: WealthCountry[];
};

const tabs = [
  { id: "g7", label: "G7" },
  { id: "g20", label: "G20" },
  { id: "saarc", label: "SAARC" },
  { id: "asia", label: "Asia" },
] as const;

function formatCurrency(value: number) {
  return intlDollar.format(value * 1_000_000_000);
}

export function NationWealthTabs({
  groups,
}: {
  groups: Record<string, WealthGroup>;
}) {
  const [activeTab, setActiveTab] = React.useState<
    (typeof tabs)[number]["id"]
  >("g7");
  const [metric, setMetric] = React.useState<
    "per_capita" | "total"
  >("per_capita");

  const group = groups[activeTab];
  const countries = group?.countries ?? [];
  const chartRef = React.useRef<HTMLDivElement | null>(null);
  const india =
    countries.find((item) => item.country === "India") ??
    Object.values(groups)
      .flatMap((item) => item.countries)
      .find((item) => item.country === "India" && item.data_available);

  React.useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const metricKey =
      metric === "per_capita"
        ? "net_financial_assets_per_capita_eur"
        : "net_financial_assets_eur_bn";

    const sorted = [...countries]
      .filter((item) => item.data_available)
      .sort((a, b) => (b[metricKey] ?? 0) - (a[metricKey] ?? 0));

    chart.setOption({
      grid: { left: 12, right: 12, bottom: 24, top: 12, containLabel: true },
      tooltip: {
        trigger: "item",
        formatter: (params: { dataIndex: number }) => {
          const item = sorted[params.dataIndex];
          if (!item) return "";
          const value = item[metricKey];
          if (value == null) return `${item.country}<br/>No data`;
          if (metric === "per_capita") {
            return `${item.country}<br/>Per capita: ${intlDollar.format(value)}`;
          }
          return `${item.country}<br/>Total: ${formatCurrency(value)}`;
        },
      },
      xAxis: {
        type: "value",
        axisLabel: {
          color: "#7a6f63",
          fontSize: 10,
          formatter: (value: number) =>
            metric === "per_capita"
              ? intlDollar.format(value)
              : `${value.toFixed(0)} bn`,
        },
        splitLine: { lineStyle: { color: "#efe5da" } },
      },
      yAxis: {
        type: "category",
        data: sorted.map((item) => item.country),
        axisLabel: { color: "#7a6f63", fontSize: 10 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#e5dbcf" } },
      },
      series: [
        {
          type: "bar",
          data: sorted.map((item) => item[metricKey] ?? 0),
          barWidth: "52%",
          itemStyle: {
            color: (params: { dataIndex: number }) => {
              const name = sorted[params.dataIndex]?.country ?? "";
              if (name === "India") return "#e07a5f";
              return params.dataIndex % 2 === 0 ? "#f4b47d" : "#7dd9c5";
            },
            borderRadius: [8, 8, 8, 8],
          },
          label: {
            show: true,
            position: "right",
            formatter: (params: { value: number }) => {
              if (!params.value) return "N/A";
              return metric === "per_capita"
                ? intlDollar.format(params.value)
                : `${params.value.toFixed(0)} bn`;
            },
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
  }, [countries, metric, activeTab]);

  return (
    <section className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7a6f63]">
            Nation wealth
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#1f1d1a]">
            India vs peers
          </h2>
          <p className="mt-1 text-xs text-[#7a6f63]">
            Net financial assets of households (Allianz Global Wealth Report 2023).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMetric("per_capita")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            metric === "per_capita"
              ? "border-[#e07a5f] bg-[#fff1e8] text-[#a3572c]"
              : "border-[#e5dbcf] bg-white text-[#6b6156]"
          }`}
        >
          Per capita
        </button>
        <button
          type="button"
          onClick={() => setMetric("total")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            metric === "total"
              ? "border-[#e07a5f] bg-[#fff1e8] text-[#a3572c]"
              : "border-[#e5dbcf] bg-white text-[#6b6156]"
          }`}
        >
          Total wealth
        </button>
      </div>

      <div className="mt-4">
        <div ref={chartRef} className="h-[520px] w-full" />
      </div>

      {india?.net_financial_assets_eur_bn ? (
        <div className="mt-6">
          <BigNumberExplainer
            valueBn={india.net_financial_assets_eur_bn}
            label="India's net financial assets (2022)"
            currencyLabel="EUR"
          />
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 text-xs text-[#5f564c]">
        {countries.map((item) => (
          <div
            key={item.country}
            className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] px-4 py-2"
          >
            <span className="font-semibold text-[#1f1d1a]">{item.country}</span>
            <span>
              Total: {item.net_financial_assets_eur_bn == null ? "N/A" : `${item.net_financial_assets_eur_bn} bn EUR`}
            </span>
            <span>
              Per capita: {item.net_financial_assets_per_capita_eur == null ? "N/A" : intlDollar.format(item.net_financial_assets_per_capita_eur)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
