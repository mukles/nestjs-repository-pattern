import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).optional(),
});

export const updateRoleSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
  name: z.string().min(1, "Role name is required").optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).optional(),
});

export const deleteRoleSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});
