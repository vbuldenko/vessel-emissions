export type Vessel = {
  id: number;
  name: string;
  imoNo: number;
  vesselType: number;
  maxDeadWg: number;
  createdAt: Date;
  updatedAt: Date;
  emissions?: Emission[];
  references?: Reference[];
};

export type Emission = {
  id: number;
  vesselId: number;
  logId: bigint;
  fromUtc: Date;
  toUtc: Date;
  metCo2: number;
  aetCo2: number;
  botCo2: number;
  vrtCo2: number;
  totTCo2: number;
  mewCo2e: number;
  aewCo2e: number;
  bowCo2e: number;
  vrwCo2e: number;
  totWCo2e: number;
  meSox: number;
  aeSox: number;
  boSox: number;
  vrSox: number;
  totSox: number;
  meNox: number;
  aeNox: number;
  totNox: number;
  mePm10: number;
  aePm10: number;
  totPm10: number;
  aerCo2T2w: number;
  aerCo2eW2w: number;
  eeoiCo2eW2w: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Reference = {
  rowId: number;
  category: string;
  vesselTypeId: number;
  size: string;
  traj: string;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
};

export type QuarterlyEmissionData = {
  quarterKey: string;
  year: number;
  quarter: number;
  date: Date;
  emission: Emission;
};
