import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['ACTIVE', 'INACTIVE'])
});