/**
 * 로딩 스피너
 * - Suspense fallback으로 사용
 * - 접근성: aria-label 제공
 */
export const LoadingSpinner = () => {
  return (
    <div
      className="flex items-center justify-center min-h-[200px]"
      role="status"
      aria-label="로딩 중"
    >
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};
