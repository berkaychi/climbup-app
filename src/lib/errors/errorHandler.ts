export enum ErrorType {
  NETWORK = "network",
  AUTH = "authentication",
  VALIDATION = "validation",
  SERVER = "server",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  TIMEOUT = "timeout",
  UNKNOWN = "unknown",
}

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: Error;
  context?: Record<string, unknown>;
  timestamp: Date;
}

export class ErrorHandler {
  static createError(
    type: ErrorType,
    message: string,
    statusCode?: number,
    originalError?: Error,
    context?: Record<string, unknown>
  ): AppError {
    return {
      type,
      message,
      statusCode,
      originalError,
      context,
      timestamp: new Date(),
    };
  }

  static fromHttpStatus(
    statusCode: number,
    message?: string,
    originalError?: Error
  ): AppError {
    let type: ErrorType;
    let defaultMessage: string;

    switch (statusCode) {
      case 400:
        type = ErrorType.VALIDATION;
        defaultMessage = "Geçersiz istek. Lütfen bilgilerinizi kontrol edin.";
        break;
      case 401:
        type = ErrorType.UNAUTHORIZED;
        defaultMessage = "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
        break;
      case 403:
        type = ErrorType.FORBIDDEN;
        defaultMessage = "Bu işlem için yetkiniz bulunmuyor.";
        break;
      case 404:
        type = ErrorType.NOT_FOUND;
        defaultMessage = "Aradığınız kaynak bulunamadı.";
        break;
      case 408:
        type = ErrorType.TIMEOUT;
        defaultMessage = "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
        break;
      case 429:
        type = ErrorType.NETWORK;
        defaultMessage =
          "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.";
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        type = ErrorType.SERVER;
        defaultMessage =
          "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
        break;
      default:
        type = ErrorType.UNKNOWN;
        defaultMessage = "Beklenmeyen bir hata oluştu.";
    }

    return this.createError(
      type,
      message || defaultMessage,
      statusCode,
      originalError,
      { statusCode }
    );
  }

  static fromFetchError(error: Error): AppError {
    if (error.name === "AbortError") {
      return this.createError(
        ErrorType.TIMEOUT,
        "İstek zaman aşımına uğradı.",
        408,
        error
      );
    }

    if (error.message.includes("Failed to fetch")) {
      return this.createError(
        ErrorType.NETWORK,
        "Ağ bağlantısı sorunu. İnternet bağlantınızı kontrol edin.",
        0,
        error
      );
    }

    return this.createError(
      ErrorType.UNKNOWN,
      error.message || "Bilinmeyen bir hata oluştu.",
      undefined,
      error
    );
  }

  static getUserFriendlyMessage(error: AppError): string {
    const baseMessage = error.message;

    // Add action suggestions based on error type
    switch (error.type) {
      case ErrorType.NETWORK:
        return `${baseMessage} İnternet bağlantınızı kontrol edip tekrar deneyin.`;
      case ErrorType.AUTH:
      case ErrorType.UNAUTHORIZED:
        return `${baseMessage} Sayfayı yenileyip tekrar giriş yapmayı deneyin.`;
      case ErrorType.SERVER:
        return `${baseMessage} Sorun devam ederse destek ekibiyle iletişime geçin.`;
      case ErrorType.VALIDATION:
        return `${baseMessage} Formdaki bilgileri kontrol edin.`;
      default:
        return baseMessage;
    }
  }

  static shouldRetry(error: AppError): boolean {
    return (
      error.type === ErrorType.NETWORK ||
      error.type === ErrorType.TIMEOUT ||
      (error.type === ErrorType.SERVER &&
        (error.statusCode === 502 || error.statusCode === 503))
    );
  }

  static logError(error: AppError): void {
    const logData = {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      context: error.context,
      stack: error.originalError?.stack,
    };

    if (
      error.type === ErrorType.SERVER ||
      (error.statusCode && error.statusCode >= 500)
    ) {
      console.error("Server Error:", logData);
    } else if (
      error.type === ErrorType.AUTH ||
      error.type === ErrorType.UNAUTHORIZED
    ) {
      console.warn("Auth Error:", logData);
    } else {
      console.info("App Error:", logData);
    }

    // In production, send to error tracking service (Sentry, etc.)
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error.originalError || new Error(error.message));
    }
  }
}

// Hook for error handling in React components
export function useErrorHandler() {
  const handleError = (error: unknown, context?: Record<string, unknown>) => {
    let appError: AppError;

    if (error instanceof Error) {
      if (error.name === "ApiError") {
        const apiError = error as Error & { status?: number };
        appError = ErrorHandler.fromHttpStatus(
          apiError.status || 500,
          error.message,
          error
        );
      } else {
        appError = ErrorHandler.fromFetchError(error);
      }
    } else if (typeof error === "string") {
      appError = ErrorHandler.createError(ErrorType.UNKNOWN, error);
    } else {
      appError = ErrorHandler.createError(ErrorType.UNKNOWN, "Bilinmeyen hata");
    }

    if (context) {
      appError.context = { ...appError.context, ...context };
    }

    ErrorHandler.logError(appError);
    return appError;
  };

  return { handleError };
}
