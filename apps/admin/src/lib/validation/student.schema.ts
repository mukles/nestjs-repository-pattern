import { Gender, StudentStatus } from "@repo/shared-types";
import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address"),

  dateOfBirth: z.string().refine((date) => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate) && parsedDate < Date.now();
  }, "Invalid date of birth"),

  gender: z.enum(Gender, {
    message: "Gender is required",
  }),

  status: z.enum(StudentStatus, {
    message: "Status is required",
  }),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
