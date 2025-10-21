import type { FallbackProps } from 'react-error-boundary';
import { logger } from '@/utils/logger';

/**
 * 에러 폴백 UI
 * - 사용자 친화적인 에러 메시지
 * - 재시도 버튼 제공
 */
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const handleRetry = () => {
    logger.info('[User Action] Retry after error');
    resetErrorBoundary();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      {/* 에러 아이콘 */}
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* 에러 메시지 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">문제가 발생했습니다</h3>
      <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
        {error.message || '일시적인 오류입니다. 다시 시도해주세요.'}
      </p>

      {/* 재시도 버튼 */}
      <button
        onClick={handleRetry}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        다시 시도
      </button>
    </div>
  );
};
