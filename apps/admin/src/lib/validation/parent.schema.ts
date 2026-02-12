import { ParentType } from "@repo/shared-types";
import { z } from "zod";

export const singleParentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  email: z.string().email("Invalid email address").optional().or(z.literal("")),

  phone: z
    .string()
    .max(20, "Phone must be at most 20 characters")
    .optional()
    .or(z.literal("")),

  occupation: z
    .string()
    .max(100, "Occupation must be at most 100 characters")
    .optional()
    .or(z.literal("")),

  type: z.nativeEnum(ParentType, {
    message: "Parent type is required",
  }),
});

export const parentSchema = z.object({
  parents: z
    .array(singleParentSchema)
    .min(1, "At least one parent is required"),
});

export type SingleParentValues = z.infer<typeof singleParentSchema>;
export type ParentFormValues = z.infer<typeof parentSchema>;
