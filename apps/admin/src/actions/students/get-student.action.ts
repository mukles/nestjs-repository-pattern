"use server";

import { GetStudentsParams, StudentDto } from "@repo/shared-types";
import { apiAction, safeAction } from "../common";

export async function getStudents(params: GetStudentsParams) {
  const urlParams = new URLSearchParams(
    Object.entries(params || {})
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  );

  return safeAction<StudentDto[]>(() => {
    return apiAction(`/students?${urlParams.toString()}`, {
      method: "GET",
    });
  });
}
