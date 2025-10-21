import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

/**
 * 요청 인터셉터
 * - 인증 토큰 자동 추가
 * - 요청 로깅
 */
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 토큰 추가 (localStorage에서 읽기 - 클라이언트에서만 실행)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // [로깅] 요청 시작
  logger.debug('[API Request]', {
    method: config.method?.toUpperCase(),
    url: config.url,
    params: config.params,
  });

  return config;
};

/**
 * 응답 인터셉터 (성공)
 * - 응답 로깅
 */
export const responseInterceptor = (response: AxiosResponse) => {
  logger.debug('[API Response]', {
    status: response.status,
    url: response.config.url,
  });

  return response;
};

/**
 * 응답 인터셉터 (에러)
 * - 에러 로깅
 * - 401: 자동 로그아웃
 * - 403: 권한 없음 안내
 * - 5xx: 서버 에러 안내
 */
export const errorInterceptor = (error: AxiosError<{ message?: string }>) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || error.message;

  // [로깅] 에러 발생
  logger.error('[API Error]', {
    status,
    url: error.config?.url,
    message,
  });

  // 상태 코드별 처리
  switch (status) {
    case 401:
      // 인증 만료 → 로그아웃 (클라이언트에서만 실행)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        toast.error('로그인이 만료되었습니다');
      }
      break;

    case 403:
      toast.error('접근 권한이 없습니다');
      break;

    case 404:
      toast.error('요청한 리소스를 찾을 수 없습니다');
      break;

    case 500:
    case 502:
    case 503:
      toast.error('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요');
      break;

    default:
      // 네트워크 에러
      if (!error.response) {
        toast.error('네트워크 연결을 확인해주세요');
      }
  }

  return Promise.reject(error);
};
