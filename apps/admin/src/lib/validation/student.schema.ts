import { Gender, StudentStatus } from "@repo/shared-types";
import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(Gender, {
    message: "Gender must be one of the allowed values",
  }),
  status: z.enum(StudentStatus, {
    message: "Status must be one of the allowed values",
  }),
  photo: z.string().optional(),
  isOrphan: z.boolean().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
