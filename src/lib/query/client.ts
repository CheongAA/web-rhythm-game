import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { logger } from '@/utils/logger';

/**
 * React Query 기본 옵션
 * - staleTime: 5분 (토스 권장)
 * - gcTime: 10분
 * - retry: 네트워크 에러만 재시도
 */
const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
    refetchOnWindowFocus: false, // 창 포커스 시 재요청 안 함
    retry: (failureCount, error: unknown) => {
      // 4xx 에러는 재시도하지 않음
      const err = error as { response?: { status?: number } };
      if (err?.response?.status && err.response.status >= 400 && err.response.status < 500) {
        return false;
      }
      return failureCount < 2; // 최대 2회 재시도
    },
    throwOnError: false, // ErrorBoundary로 에러 전파 안 함
  },
  mutations: {
    retry: false, // Mutation은 재시도 안 함
    onError: (error: unknown) => {
      // [로깅] Mutation 에러
      logger.error('[Mutation Error]', error);
    },
  },
};

/**
 * QueryClient 인스턴스
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
