import { z } from "zod";
import { Gender, StudentStatus } from "./types";

export const studentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  dateOfBirth: z.string(),
  gender: z.nativeEnum(Gender),
  status: z.nativeEnum(StudentStatus),
  photo: z.string().optional(),
  fatherId: z.number().optional(),      // <-- Fix here
  motherId: z.number().optional(),      // <-- Fix here
  guardianId: z.number().optional(),    // <-- Fix here
  guardianRelation: z.string().optional(),
  isOrphan: z.boolean().optional(),
});