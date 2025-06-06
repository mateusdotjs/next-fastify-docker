export type Client = {
  id: number;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
};

export type Allocation = {
  id: number;
  clientId: number;
  assetId: number;
  quotas: number;
  createdAt: string;
};

export type Asset = {
  id: number;
  name: string;
  value: number;
};

export type AllocationWithAsset = {
  allocation: Allocation;
  asset: Asset;
};
