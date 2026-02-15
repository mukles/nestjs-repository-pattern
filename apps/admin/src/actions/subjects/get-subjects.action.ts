"use server";

import { fakeSubjects } from "@/data/fake-classes";
import { ApiResponse, GetSubjectsParams, SubjectDto } from "@repo/shared-types";

export async function getSubjects(
  params?: GetSubjectsParams,
): Promise<ApiResponse<SubjectDto[]>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    let filteredSubjects = [...fakeSubjects];

    // Filter by name
    if (params?.name) {
      const searchTerm = params.name.toLowerCase();
      filteredSubjects = filteredSubjects.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm) ||
          subject.code.toLowerCase().includes(searchTerm),
      );
    }

    // Filter by isActive
    if (params?.isActive !== undefined) {
      filteredSubjects = filteredSubjects.filter(
        (subject) => subject.isActive === params.isActive,
      );
    }

    return {
      success: true,
      data: filteredSubjects,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: "SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
