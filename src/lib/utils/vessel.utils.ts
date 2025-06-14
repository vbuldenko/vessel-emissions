import { Emission, QuarterlyEmissionData } from "@/types";
import { PPBaselines } from "./calculate-pp-scc-baselines.util";

export function getLastDayOfEachQuarter(
  emissions: Emission[]
): QuarterlyEmissionData[] {
  if (emissions.length === 0) return [];

  // Last first
  const sortedEmissions = emissions.sort(
    (a, b) => new Date(b.toUtc).getTime() - new Date(a.toUtc).getTime()
  );

  const quarterMap = new Map<string, QuarterlyEmissionData>();

  for (const emission of sortedEmissions) {
    const date = new Date(emission.toUtc);
    const year = date.getFullYear();
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    const quarterKey = `${year}-Q${quarter}`;

    //save only the last available emission day log for each quarter
    if (!quarterMap.has(quarterKey)) {
      quarterMap.set(quarterKey, {
        quarterKey,
        year,
        quarter,
        date,
        emission,
      });
    }
  }

  return Array.from(quarterMap.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

export function getDeviation(emission: Emission, baselines: PPBaselines) {
  const emissionValue = emission.eeoiCo2eW2w; // PP EEOI metric (tons of CO₂ per nautical mile)
  const baselineMin = baselines.min.toNumber(); // PP min value (tons of CO₂ per nautical mile) for chosen year

  const deviation = ((emissionValue - baselineMin) / baselineMin) * 100;

  return Number(deviation.toFixed(2));
}
