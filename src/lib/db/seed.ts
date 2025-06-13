import { PrismaClient } from "../../generated/prisma";
import vesselsData from "../db/mock/vessels.json";
import ppReferenceData from "../db/mock/pp-reference.json";
import dailyLogData from "../db/mock/daily-log-emissions.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing existing data...");
  await prisma.emission.deleteMany();
  await prisma.reference.deleteMany();
  await prisma.vessel.deleteMany();

  console.log("Seeding vessels...");
  await prisma.vessel.createMany({
    data: vesselsData.map((vessel) => ({
      name: vessel.Name,
      imoNo: vessel.IMONo,
      vesselType: vessel.VesselType,
      maxDeadWg: vessel.MaxDeadWg,
    })),
  });
  console.log(`=== Created ${vesselsData.length} vessels ===`);

  console.log("Seeding PP references...");
  await prisma.reference.createMany({
    data: ppReferenceData.map((ref) => ({
      category: ref.Category,
      vesselTypeId: ref.VesselTypeID,
      size: ref.Size.trim(),
      traj: ref.Traj.trim(),
      a: ref.a,
      b: ref.b,
      c: ref.c,
      d: ref.d,
      e: ref.e,
    })),
  });
  console.log(`=== Created ${ppReferenceData.length} PP references ===`);

  console.log("Seeding emissions data...");
  await prisma.emission.createMany({
    data: dailyLogData.map((emission) => ({
      vesselId: emission.VesselID,
      logId: emission.LOGID,
      fromUtc: new Date(emission.FromUTC),
      toUtc: new Date(emission.TOUTC),
      metCo2: emission.MET2WCO2,
      aetCo2: emission.AET2WCO2,
      botCo2: emission.BOT2WCO2,
      vrtCo2: emission.VRT2WCO2,
      totTCo2: emission.TotT2WCO2,
      mewCo2e: emission.MEW2WCO2e,
      aewCo2e: emission.AEW2WCO2e,
      bowCo2e: emission.BOW2WCO2e,
      vrwCo2e: emission.VRW2WCO2e,
      totWCo2e: emission.ToTW2WCO2,
      meSox: emission.MESox,
      aeSox: emission.AESox,
      boSox: emission.BOSox,
      vrSox: emission.VRSox,
      totSox: emission.TotSOx,
      meNox: emission.MENOx,
      aeNox: emission.AENOx,
      totNox: emission.TotNOx,
      mePm10: emission.MEPM10,
      aePm10: emission.AEPM10,
      totPm10: emission.TotPM10,
      aerCo2T2w: emission.AERCO2T2W,
      aerCo2eW2w: emission.AERCO2eW2W,
      eeoiCo2eW2w: emission.EEOICO2eW2W,
    })),
  });

  console.log(`=== Created ${dailyLogData.length} emission records ===`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
