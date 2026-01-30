'use server';

import 'server-only';
import { z } from 'zod';

export type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

export type ErrorType =
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'UNIQUE_CONSTRAINT'
  | 'FOREIGN_KEY_CONSTRAINT'
  | 'SERVER_ERROR'
  | 'AUTH_ERROR';

export type Result<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        type: ErrorType;
        message: string;
        details?: Record<string, any>;
      } | null;
    }
  | null;

function formatZodErrors(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([field, messages]) => [
      field,
      (messages as string[] | undefined)?.[0] || 'Invalid input',
    ]),
  );
}

export async function safeAction<T>(fn: () => Promise<T>): Promise<Result<T>> {
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
          type: 'VALIDATION_ERROR',
          message: 'Invalid user data',
          details: formatZodErrors(error),
        },
      };
    }

    if (error instanceof Error) {
      return {
        error: {
          type: 'SERVER_ERROR',
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
        type: 'SERVER_ERROR',
        message: 'An unknown error occurred',
      },
    };
  }
}

// Generic API call wrapper for actions
export async function apiAction<T>(
  url: string,
  options?: RequestInit,
): Promise<Result<T>> {
  const fullUrl = `${process.env.API_BASE_URL}${url}`;
  console.log({ fullUrl });
  const res = await fetch(fullUrl, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMsg = 'Request failed';
    try {
      const error = await res.json();
      errorMsg = error.message || errorMsg;
    } catch {
      throw new Error(errorMsg);
    }
  }
  return res.json();
}

// Example usage:
// export async function login({ email, password }: { email: string; password: string }) {
//   return apiAction<AuthResponse>(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
//     method: "POST",
//     body: JSON.stringify({ email, password }),
//   });
// }
