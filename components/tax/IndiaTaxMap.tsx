"use client";

import * as React from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/india.geojson";

type StateShare = {
  state: string;
  gst_dec_2023_rs_crore: number;
  share_of_total_percent: number;
  mappable: boolean;
};

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(nct|ut)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function IndiaTaxMap({ states }: { states: StateShare[] }) {
  const chartRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let chart: echarts.ECharts | null = null;
    let mounted = true;

    const build = async () => {
      if (!chartRef.current) return;
      chart = echarts.init(chartRef.current);

      const response = await fetch(GEOJSON_URL);
      const geojson = await response.json();
      if (!mounted) return;

      echarts.registerMap("india", geojson);

      const lookup = new Map(
        states
          .filter((item) => item.mappable)
          .map((item) => [normalizeName(item.state), item])
      );

      const seriesData = geojson.features.map((feature: { properties: Record<string, string> }) => {
        const name =
          feature.properties?.ST_NM ||
          feature.properties?.state ||
          feature.properties?.NAME_1 ||
          "";
        const match = lookup.get(normalizeName(name));
        return {
          name,
          value: match ? match.share_of_total_percent : null,
          gst: match ? match.gst_dec_2023_rs_crore : null,
        };
      });

      const option: EChartsOption = {
        tooltip: {
          trigger: "item",
          formatter: (params: { name: string; value?: number; data?: { gst?: number } }) => {
            if (!params.value) {
              return `${params.name}<br/>No GST share data`;
            }
            const gst = params.data?.gst ? `${params.data.gst} cr` : "N/A";
            return `${params.name}<br/>GST share: ${params.value.toFixed(2)}%<br/>GST: ${gst}`;
          },
        },
        visualMap: {
          min: 0,
          max: Math.max(...states.map((s) => s.share_of_total_percent)),
          left: "left",
          bottom: 0,
          text: ["High", "Low"],
          inRange: {
            color: ["#fff0e6", "#f9b384", "#f2704a", "#d94841"],
          },
          textStyle: { color: "#6b6156", fontSize: 10 },
        },
        series: [
          {
            name: "GST share",
            type: "map",
            map: "india",
            emphasis: {
              label: { color: "#1f1d1a" },
              itemStyle: { areaColor: "#f4b47d" },
            },
            itemStyle: {
              borderColor: "#ffffff",
              borderWidth: 0.6,
            },
            label: {
              show: false,
            },
            data: seriesData,
          },
        ],
      };

      chart.setOption(option);

      const handleResize = () => chart?.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };

    build();

    return () => {
      mounted = false;
      chart?.dispose();
    };
  }, [states]);

  return <div ref={chartRef} className="h-[520px] w-full" />;
}
