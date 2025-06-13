import { PrismaClient } from "../../generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();
prisma.$extends({
  result: {
    vessel: {
      references: {
        needs: { vesselType: true },
        compute(vessel) {
          return prisma.reference.findMany({
            where: {
              vesselTypeId: vessel.vesselType,
            },
          });
        },
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
