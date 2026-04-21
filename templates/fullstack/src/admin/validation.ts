import { z } from 'zod';

export const updateUserAdminSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, 'At least one field must be provided');

export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;