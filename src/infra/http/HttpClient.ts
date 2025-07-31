export interface HttpRequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  signal?: AbortSignal;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpError extends Error {
  status?: number;
  response?: HttpResponse;
  config?: HttpRequestConfig;
}

export interface HttpClient {

  /**
   * Realiza uma requisição HTTP GET
   * @param url - URL do endpoint
   * @param config - Configurações opcionais da requisição
   */
  get<T = any>(
      url: string,
      config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Realiza uma requisição HTTP POST
   * @param url - URL do endpoint
   * @param data - Dados a serem enviados no corpo da requisição
   * @param config - Configurações opcionais da requisição
   */
  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Realiza uma requisição HTTP PUT
   * @param url - URL do endpoint
   * @param data - Dados a serem enviados no corpo da requisição
   * @param config - Configurações opcionais da requisição
   */
  put<T = any, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Realiza uma requisição HTTP DELETE
   * @param url - URL do endpoint
   * @param config - Configurações opcionais da requisição
   */
  delete<T = any>(
      url: string,
      config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Realiza uma requisição HTTP PATCH
   * @param url - URL do endpoint
   * @param data - Dados a serem enviados no corpo da requisição
   * @param config - Configurações opcionais da requisição
   */
  patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
}

/**
 * Factory function para criar uma instância do HttpClient
 */
export type HttpClientFactory = (config?: HttpRequestConfig) => HttpClient;
