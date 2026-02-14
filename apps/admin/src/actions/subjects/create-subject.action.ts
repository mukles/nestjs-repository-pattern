"use server";

import { fakeClasses, fakeSubjects, fakeTeachers } from "@/data/fake-classes";
import { subjectSchema } from "@/lib/validation/class.schema";
import { ApiResponse, CreateSubjectDto, SubjectDto } from "@repo/shared-types";

export async function createSubject(
  data: CreateSubjectDto,
): Promise<ApiResponse<SubjectDto>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    // Validate the data
    subjectSchema.parse(data);

    // Check for duplicate code
    const existingSubject = fakeSubjects.find(
      (s) => s.code.toUpperCase() === data.code.toUpperCase(),
    );
    if (existingSubject) {
      return {
        success: false,
        error: {
          type: "VALIDATION_ERROR",
          message: "A subject with this code already exists",
        },
      };
    }

    // Get class references from classIds
    const classReferences = data.classIds
      ? fakeClasses
          .filter((c) => data.classIds!.includes(c.id))
          .map((c) => ({ id: c.id, name: c.name }))
      : [];

    // Get teacher references from teacherIds
    const teacherReferences = data.teacherIds
      ? fakeTeachers
          .filter((t) => data.teacherIds!.includes(t.id))
          .map((t) => ({
            id: t.id,
            firstName: t.firstName,
            lastName: t.lastName,
          }))
      : [];

    const newSubject: SubjectDto = {
      id: Math.max(...fakeSubjects.map((s) => s.id)) + 1,
      name: data.name,
      code: data.code.toUpperCase(),
      description: data.description,
      isActive: true,
      classes: classReferences,
      teachers: teacherReferences,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    fakeSubjects.push(newSubject);

    return {
      success: true,
      data: newSubject,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: "VALIDATION_ERROR",
        message: error instanceof Error ? error.message : "Invalid data",
      },
    };
  }
}
