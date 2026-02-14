"use server";

import { fakeClasses } from "@/data/fake-classes";
import { classSchema } from "@/lib/validation/class.schema";
import {
  ApiResponse,
  ClassDto,
  ClassStatus,
  CreateClassDto,
} from "@repo/shared-types";

// Using fake data for now - replace with actual API calls later
export async function createClass(
  data: CreateClassDto,
): Promise<ApiResponse<ClassDto>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    // Validate the data
    classSchema.parse(data);

    const newClass: ClassDto = {
      id: Math.max(...fakeClasses.map((c) => c.id)) + 1,
      name: data.name,
      level: data.level,
      academicYear: data.academicYear,
      status: ClassStatus.ACTIVE,
      sections: [], // New classes start with no sections
      totalCapacity: 0,
      totalStudentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    fakeClasses.push(newClass);

    return {
      success: true,
      data: newClass,
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
