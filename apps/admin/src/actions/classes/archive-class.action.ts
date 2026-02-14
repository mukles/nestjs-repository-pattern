"use server";

import { fakeClasses } from "@/data/fake-classes";
import { ApiResponse, ClassStatus } from "@repo/shared-types";

// Using fake data for now - replace with actual API calls later
export async function archiveClass(id: number): Promise<ApiResponse<void>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

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

  classItem.status = ClassStatus.ARCHIVED;
  classItem.updatedAt = new Date();

  return {
    success: true,
    data: undefined,
  };
}

export async function restoreClass(id: number): Promise<ApiResponse<void>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

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

  classItem.status = ClassStatus.ACTIVE;
  classItem.updatedAt = new Date();

  return {
    success: true,
    data: undefined,
  };
}
