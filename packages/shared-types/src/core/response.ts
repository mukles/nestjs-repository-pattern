export type ErrorType =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNIQUE_CONSTRAINT"
  | "FOREIGN_KEY_CONSTRAINT"
  | "SERVER_ERROR"
  | "AUTH_ERROR";

export type ApiResponse<T = any> =
  | { success: true; data: T; meta?: Record<string, any> }
  | {
      success: false;
      error: {
        type: ErrorType;
        message: string;
        details?: Record<string, any>;
      } | null;
    }
  | null;
