"use client";

import * as React from "react";
import * as echarts from "echarts";
import { useAtomValue } from "jotai";
import { monthlyIncomeAtom } from "@/lib/tax-atoms";
import { inr } from "@/lib/format";
import { estimatePercentile, INCOME_PERCENTILES } from "@/lib/tax";

export function IncomePercentileCard() {
  const monthlyIncome = useAtomValue(monthlyIncomeAtom);
  const chartRef = React.useRef<HTMLDivElement | null>(null);
  const estimate = estimatePercentile(monthlyIncome);

  React.useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    chart.setOption({
      title: {
        text: "Income percentile estimate (PLFS 2023-24 thresholds)",
        left: "left",
        textStyle: { fontSize: 12, fontWeight: 600, color: "#1f1d1a" },
      },
      grid: { left: 12, right: 12, bottom: 32, top: 36, containLabel: true },
      tooltip: {
        trigger: "axis",
        valueFormatter: (value: number) => inr.format(value),
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { color: "#7a6f63", fontSize: 10, formatter: "{value}%" },
        splitLine: { lineStyle: { color: "#efe5da" } },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#7a6f63",
          fontSize: 10,
          formatter: (value: number) => inr.format(value),
        },
        splitLine: { lineStyle: { color: "#efe5da" } },
      },
      series: [
        {
          name: "Thresholds",
          type: "line",
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 2, color: "#2f7f6a" },
          areaStyle: {
            opacity: 0.25,
            color: "rgba(125, 217, 197, 0.35)",
          },
          data: INCOME_PERCENTILES.map((point) => [
            point.percentile,
            point.monthlyIncome,
          ]),
        },
        {
          name: "Your income",
          type: "scatter",
          symbolSize: 10,
          itemStyle: { color: "#e07a5f" },
          data: [[estimate.percentile, monthlyIncome]],
          label: {
            show: true,
            position: "top",
            color: "#1f1d1a",
            formatter: () => estimate.label,
            fontSize: 11,
            fontWeight: 600,
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
  }, [monthlyIncome, estimate.label, estimate.percentile]);

  return (
    <div className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7a6f63]">
            Income percentile
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#1f1d1a]">
            Where you stand
          </h2>
        </div>
        <div className="rounded-full border border-[#e5dbcf] bg-white px-3 py-1 text-xs text-[#7a6f63]">
          Monthly income: {inr.format(monthlyIncome)}
        </div>
      </div>
      <div className="mt-4">
        <div ref={chartRef} className="h-64 w-full" />
      </div>
      <p className="mt-3 text-xs text-[#7a6f63]">
        Percentile thresholds use PLFS 2023-24 figures from the Institute for
        Competitiveness (top 1%, top 10%, bottom 50%, bottom 10%).
      </p>
    </div>
  );
}
