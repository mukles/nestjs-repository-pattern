import { ClassLevel_VALUES, ClassStatus_VALUES } from "@repo/shared-types";
import { z } from "zod";

// Class schema - now without capacity and classTeacher (those are per section)
export const classSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  level: z.enum(ClassLevel_VALUES, {
    message: "Please select a class level",
  }),
  academicYear: z
    .string()
    .min(4, "Academic year is required")
    .regex(/^\d{4}(-\d{4})?$/, "Invalid format. Use YYYY or YYYY-YYYY"),
});

export const updateClassSchema = classSchema.partial().extend({
  status: z.enum(ClassStatus_VALUES).optional(),
});

// Section schema
export const sectionSchema = z.object({
  name: z
    .string()
    .min(1, "Section name is required")
    .max(10, "Section name too long"),
  capacity: z
    .number({ message: "Capacity must be a number" })
    .min(1, "Capacity must be at least 1")
    .max(100, "Capacity cannot exceed 100"),
  classTeacherId: z.number().optional(),
});

export const updateSectionSchema = sectionSchema.partial();

// Subject schema
export const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code cannot exceed 10 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  description: z.string().optional(),
  classIds: z.array(z.number()).optional(),
  teacherIds: z.array(z.number()).optional(),
});

export const updateSubjectSchema = subjectSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Assign subject teacher schema
export const assignSubjectTeacherSchema = z.object({
  sectionId: z.number(),
  subjectId: z.number(),
  teacherId: z.number(),
});

export type ClassFormValues = z.infer<typeof classSchema>;
export type UpdateClassFormValues = z.infer<typeof updateClassSchema>;
export type SectionFormValues = z.infer<typeof sectionSchema>;
export type UpdateSectionFormValues = z.infer<typeof updateSectionSchema>;
export type SubjectFormValues = z.infer<typeof subjectSchema>;
export type UpdateSubjectFormValues = z.infer<typeof updateSubjectSchema>;
export type AssignSubjectTeacherFormValues = z.infer<
  typeof assignSubjectTeacherSchema
>;
