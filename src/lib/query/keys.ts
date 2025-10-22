/**
 * Query Key Factory
 * - 일관된 쿼리 키 생성
 * - 타입 안전성 보장
 * - 무효화(invalidation) 용이
 *
 * @example
 * useQuery({ queryKey: queryKeys.users.list({ page: 1 }) })
 */

export const queryKeys = {
  // 인증
  auth: {
    me: () => ['auth', 'me'] as const,
    session: () => ['auth', 'session'] as const,
  },

  // 사용자
  users: {
    all: () => ['users'] as const,
    lists: () => [...queryKeys.users.all(), 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // 상품 (예시)
  products: {
    all: () => ['products'] as const,
    lists: () => [...queryKeys.products.all(), 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
} as const;

/**
 * 사용 예시:
 *
 * // 특정 상품 무효화
 * queryClient.invalidateQueries({ queryKey: queryKeys.products.detail('123') });
 *
 * // 모든 상품 목록 무효화
 * queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
 *
 * // 모든 상품 관련 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
 */
