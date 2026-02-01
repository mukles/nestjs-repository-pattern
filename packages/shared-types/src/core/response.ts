export type ErrorType =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNIQUE_CONSTRAINT"
  | "FOREIGN_KEY_CONSTRAINT"
  | "SERVER_ERROR"
  | "AUTH_ERROR";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
