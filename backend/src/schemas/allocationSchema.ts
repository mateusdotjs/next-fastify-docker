import { z } from "zod";

export const allocationSchema = z.object({
  clientId: z.number(),
  assetId: z.number(),
  quotas: z.number().min(0),
});

export const deleteAllocationSchema = z.object({
  allocationId: z.number(),
});
