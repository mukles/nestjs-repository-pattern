"use server";

import { fakeSubjects } from "@/data/fake-classes";
import { ApiResponse } from "@repo/shared-types";

export async function deleteSubject(
  id: number,
): Promise<ApiResponse<{ id: number }>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    const subjectIndex = fakeSubjects.findIndex((s) => s.id === id);

    if (subjectIndex === -1) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Subject not found",
        },
      };
    }

    // Instead of deleting, mark as inactive
    const subject = fakeSubjects[subjectIndex];
    if (subject) {
      subject.isActive = false;
      subject.updatedAt = new Date();
    }

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
