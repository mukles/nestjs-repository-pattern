"use server";

import { fakeClasses } from "@/data/fake-classes";
import { updateClassSchema } from "@/lib/validation/class.schema";
import { ApiResponse, ClassDto, UpdateClassDto } from "@repo/shared-types";

// Using fake data for now - replace with actual API calls later
export async function updateClass(
  id: number,
  data: UpdateClassDto,
): Promise<ApiResponse<ClassDto>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    // Validate the data
    updateClassSchema.parse(data);

    const classItem = fakeClasses.find((c) => c.id === id);

    if (!classItem) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Class not found",
        },
      };
    }

    // Update properties
    if (data.name !== undefined) classItem.name = data.name;
    if (data.level !== undefined) classItem.level = data.level;
    if (data.academicYear !== undefined)
      classItem.academicYear = data.academicYear;
    if (data.status !== undefined) classItem.status = data.status;
    classItem.updatedAt = new Date();

    return {
      success: true,
      data: classItem,
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
