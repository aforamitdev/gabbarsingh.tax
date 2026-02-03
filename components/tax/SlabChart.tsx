"use client";

import * as React from "react";
import * as echarts from "echarts";
import { inr } from "@/lib/format";
import type { SlabBreakdown } from "@/lib/tax";

const slabColors = [
  "#e07a5f",
  "#7dd9c5",
  "#f4b47d",
  "#7aa2f7",
  "#c792ea",
  "#6bbf59",
  "#f9844a",
];

export function SlabChart({
  data,
  title,
  onSelectionChange,
}: {
  data: SlabBreakdown[];
  title: string;
  onSelectionChange: (selection: { startIndex: number; endIndex: number }) => void;
}) {
  const chartRef = React.useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = React.useState({
    startIndex: 0,
    endIndex: Math.max(0, data.length - 1),
  });

  React.useEffect(() => {
    const resetSelection = {
      startIndex: 0,
      endIndex: Math.max(0, data.length - 1),
    };
    setSelection(resetSelection);
    onSelectionChange(resetSelection);
  }, [data, onSelectionChange]);

  React.useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const labels = data.map((slab) => `${Math.round(slab.rate * 100)}%`);
    const values = data.map((slab) => Math.round(slab.tax));

    chart.setOption({
      title: {
        text: title,
        left: "left",
        textStyle: { fontSize: 12, fontWeight: 600, color: "#1f1d1a" ,},
      },
      grid: { left: 12, right: 12, bottom: 36, top: 30, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        valueFormatter: (value: number) => inr.format(value),
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { color: "#7a6f63", fontSize: 10, interval: 0 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#e5dbcf" } },
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
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          start: 0,
          end: 100,
        },
        {
          type: "slider",
          xAxisIndex: 0,
          height: 18,
          bottom: 6,
          borderColor: "#efe5da",
          fillerColor: "rgba(224, 122, 95, 0.15)",
          handleStyle: { color: "#e07a5f" },
          textStyle: { color: "#7a6f63", fontSize: 10 },
        },
      ],
      series: [
        {
          name: "Tax by slab",
          type: "line",
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 2, color: "#2f7f6a" },
          areaStyle: {
            opacity: 0.7,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#7dd9c5" },
                { offset: 1, color: "rgba(125, 217, 197, 0.12)" },
              ],
            },
          },
          itemStyle: {
            color: "#2f7f6a",
            borderColor: "#ffffff",
            borderWidth: 1,
          },
          data: values.map((value, index) => ({
            value,
            itemStyle: {
              color: slabColors[index % slabColors.length],
            },
          })),
        },
      ],
    });

    const updateSelection = () => {
      const option = chart.getOption();
      const zoom = option.dataZoom?.[0];
      if (
        !zoom ||
        typeof zoom.start === "undefined" ||
        typeof zoom.end === "undefined"
      ) {
        return;
      }
      const startIndex = Math.round(((zoom.start as number) / 100) * (values.length - 1));
      const endIndex = Math.round(((zoom.end as number) / 100) * (values.length - 1));
      const nextSelection = {
        startIndex: Math.min(startIndex, endIndex),
        endIndex: Math.max(startIndex, endIndex),
      };
      setSelection(nextSelection);
      onSelectionChange(nextSelection);
    };

    chart.on("dataZoom", updateSelection);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      chart.off("dataZoom", updateSelection);
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data, title, onSelectionChange]);

  return (
    <div>
      <div ref={chartRef} className="h-60 w-full" />
    </div>
  );
}
