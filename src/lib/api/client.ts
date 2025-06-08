import { API_CONFIG } from "@/config/api";

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await this.fetchWithTimeout(
        url,
        {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        },
        this.timeout
      );

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP ${response.status}`,
          response.status,
          data
        );
      }

      return {
        data,
        message: data.message,
        success: true,
        status: response.status,
      };
    } catch (error) {
      // Retry logic for network errors (not for 4xx errors)
      if (
        attempt < this.retryAttempts &&
        (error instanceof ApiError ? error.status >= 500 : true)
      ) {
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest<T>(endpoint, options, attempt + 1);
      }

      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "GET",
      ...options,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }
}

export const apiClient = new ApiClient();
