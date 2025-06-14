"use client";

import { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export interface ChartDataPoint {
  quarter: string;
  date: number; // timestamp
  deviation: number; // percentage deviation from baseline
  actualEEOI: number;
  baseline: number;
  status?: "compliant" | "non-compliant";
}

export interface VesselChartData {
  vesselName: string;
  imoNo: number;
  data: ChartDataPoint[];
}

interface VesselEmissionsChartProps {
  data: VesselChartData;
  height?: number;
  showBaseline?: boolean;
  showComplianceZones?: boolean;
}

export default function VesselEmissionsChart({
  data: { vesselName, imoNo, data: chartData },
  height = 400,
  showBaseline = true,
  showComplianceZones = true,
}: VesselEmissionsChartProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No emission data available</p>
      </div>
    );
  }

  const deviationData = chartData.map((point, index) => ({
    x: index,
    y: point.deviation,
    quarter: point.quarter,
    actualEEOI: point.actualEEOI,
    baseline: point.baseline,
    status: point.status,
    date: new Date(point.date),
    color: point.status === "compliant" ? "#10B981" : "#EF4444",
  }));

  const actualEEOIData = chartData.map((point, index) => ({
    x: index,
    y: point.actualEEOI,
    quarter: point.quarter,
    baseline: point.baseline,
    status: point.status,
  }));

  const baselineData = chartData.map((point, index) => ({
    x: index,
    y: point.baseline,
  }));

  // Highcharts configuration
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "line",
      height: height,
      backgroundColor: "#ffffff",
      style: {
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
    title: {
      text: vesselName
        ? `${vesselName} - Emission Deviation from Baseline`
        : "",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#111827",
      },
    },
    subtitle: {
      text: imoNo ? `IMO: ${imoNo}` : "",
      style: {
        fontSize: "14px",
        color: "#6B7280",
      },
    },
    xAxis: {
      categories: chartData.map((point) => point.quarter),
      title: {
        text: "Quarter",
        style: {
          color: "#374151",
          fontWeight: "bold",
        },
      },
      labels: {
        rotation: -45,
        style: {
          color: "#4B5563",
        },
      },
      gridLineWidth: 0.5,
      gridLineColor: "#E5E7EB",
    },
    yAxis: [
      {
        // Primary Y-axis for deviation percentage
        id: "deviation-axis",
        title: {
          text: "Deviation (%)",
          style: {
            color: "#374151",
            fontWeight: "bold",
          },
        },
        labels: {
          formatter: function () {
            return this.value + "%";
          },
          style: {
            color: "#4B5563",
          },
        },
        plotLines: showBaseline
          ? [
              {
                value: 0,
                color: "#059669",
                width: 2,
                dashStyle: "Dash",
                label: {
                  text: "Baseline (0%)",
                  align: "right",
                  style: {
                    color: "#059669",
                    fontWeight: "bold",
                  },
                },
                zIndex: 5,
              },
            ]
          : [],
        plotBands: showComplianceZones
          ? [
              {
                from: -100,
                to: 0,
                color: "rgba(16, 185, 129, 0.1)",
                label: {
                  text: "Compliant Zone",
                  style: {
                    color: "#059669",
                  },
                },
              },
              {
                from: 0,
                to: 10,
                color: "rgba(245, 158, 11, 0.05)",
                label: {
                  text: "Warning Zone",
                  style: {
                    color: "#D97706",
                  },
                },
              },
              {
                from: 10,
                to: 100,
                color: "rgba(239, 68, 68, 0.1)",
                label: {
                  text: "Non-Compliant Zone",
                  style: {
                    color: "#DC2626",
                  },
                },
              },
            ]
          : [],
        gridLineWidth: 0.5,
        gridLineColor: "#E5E7EB",
      },
      {
        // Secondary Y-axis for actual EEOI values
        id: "eeoi-axis",
        title: {
          text: "EEOI (gCO₂/t·nm)",
          style: {
            color: "#374151",
            fontWeight: "bold",
          },
        },
        labels: {
          formatter: function () {
            return typeof this.value === "number"
              ? this.value.toFixed(1)
              : this.value;
          },
          style: {
            color: "#4B5563",
          },
        },
        opposite: true,
        gridLineWidth: 0,
      },
    ],
    series: [
      {
        name: "Deviation",
        type: "line",
        yAxis: "deviation-axis",
        data: deviationData,
        lineWidth: 3,
        color: "#3B82F6",
        marker: {
          enabled: true,
          radius: 5,
          symbol: "circle",
        },
        states: {
          hover: {
            lineWidth: 4,
          },
        },
        zIndex: 3,
      },
      {
        name: "Actual EEOI",
        type: "column",
        yAxis: "eeoi-axis",
        data: actualEEOIData,
        color: "rgba(96, 165, 250, 0.3)",
        borderWidth: 1,
        borderColor: "#3B82F6",
        visible: false, // Hidden by default, can be toggled
        zIndex: 1,
      },
      {
        name: "Baseline EEOI",
        type: "line",
        yAxis: "eeoi-axis",
        data: baselineData,
        color: "#059669",
        lineWidth: 2,
        dashStyle: "ShortDot",
        marker: {
          enabled: false,
        },
        visible: false, // Hidden by default, can be toggled
        zIndex: 2,
      },
    ],
    tooltip: {
      shared: false,
      useHTML: true,
      backgroundColor: "#ffffff",
      borderColor: "#D1D5DB",
      borderRadius: 8,
      shadow: true,
      formatter: function (this: any) {
        const point = this.point;
        const isDeviation = this.series.name === "Deviation";

        if (isDeviation) {
          const statusColor =
            point.status === "compliant" ? "#059669" : "#DC2626";
          const statusText =
            point.status === "compliant" ? "Compliant" : "Non-Compliant";

          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${
                point.quarter
              }</div>
              <div style="margin-bottom: 4px;">${point.date.toLocaleDateString()}</div>
              <div style="margin-bottom: 4px;">
                <span style="color: #3B82F6;">Actual EEOI:</span> ${point.actualEEOI.toFixed(
                  2
                )} gCO₂/t·nm
              </div>
              <div style="margin-bottom: 4px;">
                <span style="color: #059669;">Baseline:</span> ${point.baseline.toFixed(
                  2
                )} gCO₂/t·nm
              </div>
              <div style="margin-bottom: 4px;">
                <span style="color: ${point.y >= 0 ? "#DC2626" : "#059669"};">
                  Deviation: ${point.y > 0 ? "+" : ""}${point.y.toFixed(1)}%
                </span>
              </div>
              <div>
                <span style="background-color: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ${statusText}
                </span>
              </div>
            </div>
          `;
        }

        return `<b>${this.series.name}</b><br/>${this.x}: ${this.y}`;
      },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "#374151",
      },
    },
    credits: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 768,
          },
          chartOptions: {
            xAxis: {
              labels: {
                rotation: -90,
              },
            },
            yAxis: [
              {
                title: {
                  text: null,
                },
              },
              {
                title: {
                  text: null,
                },
              },
            ],
          },
        },
      ],
    },
  };

  return (
    <div className="w-full">
      {/* Chart */}
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        ref={chartComponentRef}
      />

      {/* Chart Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-800 font-medium">Compliant Quarters</p>
          <p className="text-2xl font-bold text-green-900">
            {chartData.filter((d) => d.status === "compliant").length}
          </p>
        </div>

        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-red-800 font-medium">Non-Compliant</p>
          <p className="text-2xl font-bold text-red-900">
            {chartData.filter((d) => d.status === "non-compliant").length}
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-800 font-medium">Avg Deviation</p>
          <p className="text-2xl font-bold text-blue-900">
            {(
              chartData.reduce((sum, d) => sum + d.deviation, 0) /
              chartData.length
            ).toFixed(1)}
            %
          </p>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-yellow-800 font-medium">Worst Deviation</p>
          <p className="text-2xl font-bold text-yellow-900">
            +
            {Math.max(...chartData.map((d) => Math.abs(d.deviation))).toFixed(
              1
            )}
            %
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="size-4 bg-green-500 rounded-full"></div>
          <span>Compliant (≤ baseline)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 bg-red-500 rounded-full"></div>
          <span>Non-Compliant (&gt; baseline)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-dashed border-t-3 border-green-600"></div>
          <span>Baseline (0% deviation)</span>
        </div>
      </div>
    </div>
  );
}
