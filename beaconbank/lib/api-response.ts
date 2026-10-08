export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  code?: number
}

export function successResponse<T>(message: string, data: T, code: number = 200): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    code,
  }
}

export function errorResponse(message: string, error: string, code: number = 400): ApiResponse {
  return {
    success: false,
    message,
    error,
    code,
  }
}

export function validationError(errors: Record<string, string>): ApiResponse {
  return {
    success: false,
    message: "Validation failed",
    error: JSON.stringify(errors),
    code: 422,
  }
}

export function notFoundError(resource: string): ApiResponse {
  return {
    success: false,
    message: `${resource} not found`,
    error: "NOT_FOUND",
    code: 404,
  }
}

export function unauthorizedError(): ApiResponse {
  return {
    success: false,
    message: "Unauthorized",
    error: "UNAUTHORIZED",
    code: 401,
  }
}

export function forbiddenError(): ApiResponse {
  return {
    success: false,
    message: "Forbidden",
    error: "FORBIDDEN",
    code: 403,
  }
}
