import { AxiosError } from "axios";

type ApiErrorType = {
  status: number;
  isOperational: boolean;
  message?: string;
  myMessage?: string;
  error?: any;
};

export class ApiError extends Error implements ApiErrorType {
  status: number;
  isOperational: boolean;
  myMessage?: string;
  error?: any;
  otherMessage?: any;

  constructor(
    status: number,
    isOperational: boolean,
    message?: string,
    myMessage?: string,
    error?: any
  ) {
    super(message);
    this.otherMessage = JSON.stringify(message);
    this.name = "ApiError";
    this.status = status || 500;
    this.isOperational = isOperational;
    this.myMessage = myMessage;
    this.error = error;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static catchError(error: unknown, defaultMessage = "Something went wrong") {
    if (error instanceof ApiError) return error;

    if (error instanceof AxiosError) {
      const axiosError = error.response as any;
      return new ApiError(
        axiosError?.status,
        false,
        axiosError.data ?? defaultMessage,
        (error as any)?.myMessage ?? defaultMessage
      );
    }
    return new ApiError(
      500,
      false,
      (error as any)?.message ?? defaultMessage,
      (error as any)?.myMessage ?? defaultMessage
    );
  }
}
