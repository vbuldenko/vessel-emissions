"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { VesselChartData } from "./VesselChart";

export default function MultiVesselChart({
  data,
}: {
  data: VesselChartData[];
}) {
  if (!data?.length) return <div>No data</div>;

  const allQuarters = [
    ...new Set(data.flatMap((vessel) => vessel.data.map((d) => d.quarter))),
  ];
  const colors = ["blue", "red", "green", "orange"];

  const series = data.map((vessel, i) => ({
    name: vessel.vesselName,
    data: allQuarters.map((quarter) => {
      const point = vessel.data.find((d) => d.quarter === quarter);
      return point?.deviation || null;
    }),
    color: colors[i % colors.length],
  }));

  const options: Highcharts.Options = {
    chart: { type: "spline" },
    title: { text: "Multi-Vessel Comparison" },
    xAxis: { categories: allQuarters },
    yAxis: {
      title: { text: "Deviation (%)" },
      plotLines: [{ value: 1, color: "black", dashStyle: "Dash" }],
    },
    series: series as any,
    credits: { enabled: false },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
