import { ApiResponse } from "@repo/shared-types";
import { apiAction, safeAction } from "../common";

export async function createStudent(
  formData: FormData,
): Promise<ApiResponse<void>> {
  return safeAction(async () => {
    return await apiAction<void>("/students", {
      method: "POST",
      body: formData,
    });
  });
}
