import type { ApiError, HttpStatusCode } from '../types';

// API base URL (Our NestJS Backend)
const API_BASE_URL = 'http://localhost:3002/api';

/**
 * Generic HTTP Client Class
 * JSONPlaceholder API ile iletişim kurmak için optimize edilmiş
 */
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw await this.handleHttpError(response);
      }

      const jsonResponse = await response.json();
      
      // Backend ResponseInterceptor formatını handle et
      if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
        return jsonResponse.data as T;
      }
      
      return jsonResponse as T;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T, U>(endpoint: string, data: U): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await this.handleHttpError(response);
      }

      const jsonResponse = await response.json();
      
      // Backend ResponseInterceptor formatını handle et
      if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
        return jsonResponse.data as T;
      }
      
      return jsonResponse as T;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T, U>(endpoint: string, data: U): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await this.handleHttpError(response);
      }

      const jsonResponse = await response.json();
      
      // Backend ResponseInterceptor formatını handle et
      if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
        return jsonResponse.data as T;
      }
      
      return jsonResponse as T;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T, U>(endpoint: string, data: U): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw await this.handleHttpError(response);
      }

      const jsonResponse = await response.json();
      
      // Backend ResponseInterceptor formatını handle et
      if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
        return jsonResponse.data as T;
      }
      
      return jsonResponse as T;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T = void>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw await this.handleHttpError(response);
      }

      // DELETE request'ler boş response döndürebilir
      const text = await response.text();
      if (!text) {
        return {} as T;
      }
      
      const jsonResponse = JSON.parse(text);
      
      // Backend ResponseInterceptor formatını handle et
      if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
        return jsonResponse.data as T;
      }
      
      return jsonResponse as T;
    } catch (error) {
      throw this.handleRequestError(error);
    }
  }

  /**
   * HTTP hatalarını işle
   */
  private async handleHttpError(response: Response): Promise<ApiError> {
    const status = response.status as HttpStatusCode;
    let message = `HTTP Error: ${status}`;
    let details = '';

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
      details = errorBody.details || '';
    } catch {
      // JSON parse hatası durumunda default mesajı kullan
      message = response.statusText || message;
    }

    return {
      status,
      message,
      details,
    };
  }

  /**
   * Request hatalarını işle (network, parsing vb.)
   */
  private handleRequestError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'status' in error) {
      return error as ApiError;
    }

    if (error instanceof Error) {
      return {
        status: 0, // Network hatası
        message: error.message || 'Network error occurred',
        details: 'Request failed due to network issues',
      };
    }

    return {
      status: 0,
      message: 'Unknown error occurred',
      details: 'An unexpected error happened during the request',
    };
  }

  /**
   * Base URL'i değiştir (development/production için)
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Mevcut base URL'i al
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Singleton instance
export const apiClient = new ApiClient();

/**
 * API response'larını beklenmedik durumlar için kontrol et
 */
export const validateApiResponse = <T>(data: unknown): T => {
  if (data === null || data === undefined) {
    throw new Error('API returned null or undefined data');
  }
  return data as T;
};

/**
 * API çağrısında artificial delay ekle (UX için loading göstermek)
 */
export const addLoadingDelay = async (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};