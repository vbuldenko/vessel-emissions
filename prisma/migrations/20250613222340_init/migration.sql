-- CreateTable
CREATE TABLE "vessels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imoNo" INTEGER NOT NULL,
    "vesselType" INTEGER NOT NULL,
    "maxDeadWg" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vessels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emission_logs" (
    "id" SERIAL NOT NULL,
    "vesselId" INTEGER NOT NULL,
    "logId" BIGINT NOT NULL,
    "fromUtc" TIMESTAMP(3) NOT NULL,
    "toUtc" TIMESTAMP(3) NOT NULL,
    "metCo2" DOUBLE PRECISION NOT NULL,
    "aetCo2" DOUBLE PRECISION NOT NULL,
    "botCo2" DOUBLE PRECISION NOT NULL,
    "vrtCo2" DOUBLE PRECISION NOT NULL,
    "totTCo2" DOUBLE PRECISION NOT NULL,
    "mewCo2e" DOUBLE PRECISION NOT NULL,
    "aewCo2e" DOUBLE PRECISION NOT NULL,
    "bowCo2e" DOUBLE PRECISION NOT NULL,
    "vrwCo2e" DOUBLE PRECISION NOT NULL,
    "totWCo2e" DOUBLE PRECISION NOT NULL,
    "meSox" DOUBLE PRECISION NOT NULL,
    "aeSox" DOUBLE PRECISION NOT NULL,
    "boSox" DOUBLE PRECISION NOT NULL,
    "vrSox" DOUBLE PRECISION NOT NULL,
    "totSox" DOUBLE PRECISION NOT NULL,
    "meNox" DOUBLE PRECISION NOT NULL,
    "aeNox" DOUBLE PRECISION NOT NULL,
    "totNox" DOUBLE PRECISION NOT NULL,
    "mePm10" DOUBLE PRECISION NOT NULL,
    "aePm10" DOUBLE PRECISION NOT NULL,
    "totPm10" DOUBLE PRECISION NOT NULL,
    "aerCo2T2w" DOUBLE PRECISION NOT NULL,
    "aerCo2eW2w" DOUBLE PRECISION NOT NULL,
    "eeoiCo2eW2w" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emission_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pp_references" (
    "rowId" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "vesselTypeId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "Traj" TEXT NOT NULL,
    "a" DOUBLE PRECISION NOT NULL,
    "b" DOUBLE PRECISION NOT NULL,
    "c" DOUBLE PRECISION NOT NULL,
    "d" DOUBLE PRECISION NOT NULL,
    "e" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "pp_references_pkey" PRIMARY KEY ("rowId")
);

-- CreateIndex
CREATE UNIQUE INDEX "vessels_imoNo_key" ON "vessels"("imoNo");

-- CreateIndex
CREATE INDEX "emission_logs_vesselId_toUtc_idx" ON "emission_logs"("vesselId", "toUtc");

-- CreateIndex
CREATE INDEX "pp_references_vesselTypeId_Traj_idx" ON "pp_references"("vesselTypeId", "Traj");

-- AddForeignKey
ALTER TABLE "emission_logs" ADD CONSTRAINT "emission_logs_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "vessels"("imoNo") ON DELETE RESTRICT ON UPDATE CASCADE;
