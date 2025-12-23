export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  error: string;
  message: string | string[];
  timestamp: string;
  statusCode: number;
}
