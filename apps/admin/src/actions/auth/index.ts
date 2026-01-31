"use server";
import "server-only";

import { createSession, deleteSession } from "@/lib/session";
import { loginUserSchema } from "@/lib/validation/user.schema";
import { redirect } from "next/navigation";
import { AuthResponse } from "./types";
import { apiAction, Result, safeAction } from "../common";

export const loginUser = async (
  _state: Result<AuthResponse>,
  formData: FormData,
) => {
  return safeAction(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = loginUserSchema.parse(data);
    const response = await apiAction<AuthResponse>("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    await createSession(response.accessToken, response.refreshToken);

    return response;
  });
};

export async function logout() {
  await deleteSession();
  redirect("/login");
}
