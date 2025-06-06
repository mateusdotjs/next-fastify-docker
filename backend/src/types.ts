// types/prismaTypes.ts

export type Status = "ACTIVE" | "INACTIVE";

export type Client = {
  id: number;
  name: string;
  email: string;
  status: Status;
  allocations?: Allocation[];
};

export type Allocation = {
  id: number;
  clientId: number;
  assetId: number;
  quotas: number;
  createdAt: Date;
};
