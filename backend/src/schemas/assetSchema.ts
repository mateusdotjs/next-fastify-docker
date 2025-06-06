import { z } from 'zod';

export const assetSchema = z.object({
  name: z.string(),
  value: z.number().nonnegative()
});
