import { Gender, StudentStatus } from "@repo/shared-types";
import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  dateOfBirth: z.string(),
  gender: z.enum(Gender),
  status: z.enum(StudentStatus),

  fatherId: z.string().optional(),
  motherId: z.string().optional(),
  guardianId: z.string().optional(),

  photo: z.string().optional(),
  guardianRelation: z.string().optional(),
  isOrphan: z.boolean().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
