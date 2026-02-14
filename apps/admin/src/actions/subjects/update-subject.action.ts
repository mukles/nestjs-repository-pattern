"use server";

import { fakeClasses, fakeSubjects, fakeTeachers } from "@/data/fake-classes";
import { updateSubjectSchema } from "@/lib/validation/class.schema";
import { ApiResponse, SubjectDto, UpdateSubjectDto } from "@repo/shared-types";

export async function updateSubject(
  id: number,
  data: UpdateSubjectDto,
): Promise<ApiResponse<SubjectDto>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    // Validate the data
    updateSubjectSchema.parse(data);

    const subject = fakeSubjects.find((s) => s.id === id);

    if (!subject) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Subject not found",
        },
      };
    }

    // Check for duplicate code if code is being updated
    if (data.code) {
      const existingSubject = fakeSubjects.find(
        (s) => s.code.toUpperCase() === data.code!.toUpperCase() && s.id !== id,
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
    }

    // Update properties
    if (data.name !== undefined) subject.name = data.name;
    if (data.code !== undefined) subject.code = data.code.toUpperCase();
    if (data.description !== undefined) subject.description = data.description;
    if (data.isActive !== undefined) subject.isActive = data.isActive;

    // Update class assignments
    if (data.classIds !== undefined) {
      subject.classes = fakeClasses
        .filter((c) => data.classIds!.includes(c.id))
        .map((c) => ({ id: c.id, name: c.name }));
    }

    // Update teacher assignments
    if (data.teacherIds !== undefined) {
      subject.teachers = fakeTeachers
        .filter((t) => data.teacherIds!.includes(t.id))
        .map((t) => ({
          id: t.id,
          firstName: t.firstName,
          lastName: t.lastName,
        }));
    }

    subject.updatedAt = new Date();

    return {
      success: true,
      data: subject,
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
