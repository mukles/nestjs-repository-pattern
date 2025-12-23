export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
  stack: string;
  details?: string[];
}
