"use server";

import { decrypt } from "@/lib/session";
import { ApiResponse } from "@repo/shared-types";
import { cookies } from "next/headers";
import "server-only";
import { z } from "zod";

export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

function formatZodErrors(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([field, messages]) => [
      field,
      (messages as string[] | undefined)?.[0] || "Invalid input",
    ]),
  );
}

export async function safeAction<T>(
  fn: () => Promise<T>,
): Promise<ApiResponse<T>> {
  try {
    const response = await fn();
    return {
      data: response,
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          type: "VALIDATION_ERROR",
          message: "Invalid user data",
          details: formatZodErrors(error),
        },
      };
    }

    if (error instanceof Error) {
      return {
        error: {
          type: "SERVER_ERROR",
          message: error.message,
          details: {
            originalError: error.stack,
          },
        },
        success: false,
      };
    }
    return {
      success: false,
      error: {
        type: "SERVER_ERROR",
        message: "An unknown error occurred",
      },
    };
  }
}

export async function apiAction<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const { accessToken } = (await decrypt(session)) || {};

  const fullUrl = `${process.env.API_BASE_URL}${url}`;

  // Don't set Content-Type for FormData, let the browser handle it
  const headers: Record<string, string> = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  if (!(options?.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(fullUrl, {
    credentials: "include",
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = "Request failed";
    try {
      const error = await res.json();
      errorMsg = error.message || errorMsg;
    } catch {
      throw new Error(errorMsg);
    }
    throw new Error(errorMsg);
  }

  const result = await res.json();
  return result && typeof result === "object" && "data" in result
    ? result.data
    : result;
}
