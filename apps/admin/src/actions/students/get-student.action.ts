"use server";

import { apiAction, safeAction } from "../common";
import { GetStudentsParams } from "./type";

export async function getStudents(params: GetStudentsParams) {
  const urlParams = new URLSearchParams(
    Object.entries(params || {})
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  );

  console.log("Fetching students with params:", urlParams.toString());

  return safeAction(() => {
    return apiAction(`/students?${urlParams.toString()}`, {
      method: "GET",
    });
  });
}
