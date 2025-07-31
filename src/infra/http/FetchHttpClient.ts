import type {
  HttpClient,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
  HttpClientFactory
} from './HttpClient';

class FetchError extends Error implements HttpError {
  public status?: number;
  public response?: HttpResponse;
  public config?: HttpRequestConfig;

  constructor(
      message: string,
      status?: number,
      response?: HttpResponse,
      config?: HttpRequestConfig
  ) {
    super(message);
    this.config = config;
    this.response = response;
    this.status = status;
    this.name = 'FetchError';
  }
}

export class FetchHttpClient implements HttpClient {
  public readonly baseURL: string;

  constructor(config?: HttpRequestConfig) {
    this.baseURL = config?.baseURL || '';
  }

  private buildRequest(
      method: string,
      _url: string,
      data?: any,
      config?: HttpRequestConfig
  ): RequestInit {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...config?.headers,
    });

    const requestInit: RequestInit = {
      method,
      headers,
      signal: config?.signal,
    };

    if (data) {
      requestInit.body = JSON.stringify(data);
    }

    return requestInit;
  }

  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    // Combina baseURL com a URL relativa
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (!params) return fullUrl;

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    return `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${queryParams.toString()}`;
  }

  private async processResponse<T>(
      response: Response,
      config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    let data: T;

    switch (config?.responseType) {
      case 'text':
        data = await response.text() as T;
        break;
      case 'blob':
        data = await response.blob() as T;
        break;
      case 'arraybuffer':
        data = await response.arrayBuffer() as T;
        break;
      case 'json':
      default:
        data = await response.json();
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    if (!response.ok) {
      throw new FetchError(
          response.statusText,
          response.status,
          { data, status: response.status, statusText: response.statusText, headers },
          config
      );
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
    };
  }

  private async executeRequest<T>(
      method: string,
      url: string,
      data?: any,
      config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const finalUrl = this.buildUrl(url, config?.params);
    const requestInit = this.buildRequest(method, finalUrl, data, config);

    try {
      let timeoutId: number | undefined;

      const fetchPromise = fetch(finalUrl, requestInit);

      const timeoutPromise = new Promise<never>((_, reject) => {
        if (config?.timeout) {
          timeoutId = setTimeout(() => {
            reject(new FetchError('Request timeout', undefined, undefined, config));
          }, config.timeout);
        }
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      timeoutId && clearTimeout(timeoutId);

      return await this.processResponse<T>(response as Response, config);
    } catch (error) {
      if (error instanceof FetchError) {
        throw error;
      }
      throw new FetchError(
          error instanceof Error ? error.message : 'Network error',
          undefined,
          undefined,
          config
      );
    }
  }

  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('GET', url, undefined, config);
  }

  async post<T, D>(
      url: string,
      data?: D,
      config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('POST', url, data, config);
  }

  async put<T, D>(
      url: string,
      data?: D,
      config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('DELETE', url, undefined, config);
  }

  async patch<T, D>(
      url: string,
      data?: D,
      config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('PATCH', url, data, config);
  }
}

export const createFetchClient: HttpClientFactory = (config?: HttpRequestConfig) =>
    new FetchHttpClient(config);
