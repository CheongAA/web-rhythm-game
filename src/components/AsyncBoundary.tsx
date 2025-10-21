'use client';

import { Suspense, ComponentType, ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorFallback } from './ErrorFallback';
import { logger } from '@/utils/logger';

interface AsyncBoundaryProps {
  children: ReactNode;
  /** Suspense 로딩 컴포넌트 */
  LoadingFallback?: ComponentType;
  /** 에러 폴백 컴포넌트 */
  ErrorFallback?: ComponentType<FallbackProps>;
  /** 재시도 시 실행할 함수 */
  onReset: () => void;
  /** 에러 발생 시 콜백 (로깅 등) */
  onError?: (error: Error, info: ErrorInfo) => void;
}

/**
 * AsyncBoundary: Suspense + ErrorBoundary 통합
 * - 비동기 로딩/에러 상태를 선언적으로 처리
 * - 재시도(retry) 기능 제공
 *
 * @example
 * <AsyncBoundary>
 *   <ProductList />
 * </AsyncBoundary>
 */
export const AsyncBoundary = ({
  children,
  LoadingFallback = LoadingSpinner,
  ErrorFallback: CustomErrorFallback = ErrorFallback,
  onReset,
  onError,
}: AsyncBoundaryProps) => {
  const handleError = (error: Error, info: ErrorInfo) => {
    // [로깅] 에러 발생
    logger.error('[AsyncBoundary Error]', {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });

    onError?.(error, info);
  };

  return (
    <ErrorBoundary FallbackComponent={CustomErrorFallback} onError={handleError} onReset={onReset}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
};
