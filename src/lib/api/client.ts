import axios, { CreateAxiosDefaults } from 'axios';
import { env } from '@/config/env';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

/**
 * Axios 기본 설정
 * - 타임아웃: 10초
 * - 자동 JSON 파싱
 */
const config: CreateAxiosDefaults = {
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // CORS 자격증명 포함 (필요 시)
  withCredentials: false,
};

/**
 * 메인 API 클라이언트
 */
export const apiClient = axios.create(config);

// 인터셉터 등록
apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

/**
 * 인증이 필요 없는 공개 API 클라이언트
 */
export const publicApiClient = axios.create(config);
publicApiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
