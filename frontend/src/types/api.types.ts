export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errorSources?: Array<{
    path: string;
    message: string;
  }>;
  stack?: string;
}
