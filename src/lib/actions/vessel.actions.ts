"use server";

import Decimal from "decimal.js";
import prisma from "../db/prisma";
import {
  calculatePPSCCBaselines,
  PPBaselines,
} from "../utils/calculate-pp-scc-baselines.util";
import { getDeviation, getLastDayOfEachQuarter } from "../utils/vessel.utils";

export async function getVessels() {
  return await prisma.vessel.findMany();
}
export async function getVesselsWithData() {
  const vessels = await prisma.vessel.findMany();
  const vesselsWithData = await Promise.all(
    vessels.map(async ({ imoNo }) => await getVesselData(imoNo))
  );
  return vesselsWithData;
}

export async function getVesselData(imoNo: number) {
  const vessel = await prisma.vessel.findFirst({
    where: { imoNo: imoNo },
    include: {
      emissions: true,
    },
  });

  if (!vessel) throw new Error("Vessel not found");

  const vesselReferences = await prisma.reference.findMany({
    where: {
      vesselTypeId: vessel.vesselType,
    },
  });

  if (!vesselReferences || vesselReferences.length === 0) {
    throw new Error("No references found for this vessel type");
  }

  const quarterlyEmissions = getLastDayOfEachQuarter(vessel.emissions);

  // Calculate baselines for each year in the quarterly emissions
  const baselinesByYear = new Map<number, PPBaselines>();
  quarterlyEmissions.forEach(({ year }) => {
    if (!baselinesByYear.has(year)) {
      const baselines = calculatePPSCCBaselines({
        factors: vesselReferences,
        year,
        DWT: new Decimal(vessel.maxDeadWg),
      });
      baselinesByYear.set(year, baselines);
    }
  });

  const quarterlyData = quarterlyEmissions.map(
    ({ quarterKey, year, quarter, date, emission }) => {
      if (!baselinesByYear.has(year)) {
        throw new Error(`No baselines found for year ${year}`);
      }

      const baselines = baselinesByYear.get(year) as PPBaselines;
      const deviation = getDeviation(emission, baselines);

      return {
        quarterKey,
        year,
        quarter, // 1, 2, 3, or 4
        date, // Last day of the quarter
        emission: emission,
        baselines,
        deviation,
        status: deviation > 0 ? "non-compliant" : "compliant",
      };
    }
  );

  return {
    ...vessel,
    references: vesselReferences,
    quarterlyData,
  };
}
