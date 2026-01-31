import { apiAction, safeAction } from "@/actions/common";

export async function getUserProfile(userId: string) {
  return safeAction(() => {
    return apiAction(`/user/${userId}/profile`, {
      method: "GET",
    });
  });
}
