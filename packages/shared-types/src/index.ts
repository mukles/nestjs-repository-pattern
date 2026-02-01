export interface LoginResponse {
  access_token: string;
  user: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export * from "./core/index";
export * from "./student/index";
