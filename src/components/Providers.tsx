'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { env } from '@/config/env';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * 전역 Provider 통합
 * - React Query
 * - 토스트 알림 (Sonner)
 * - DevTools (개발 환경)
 */
const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분
            gcTime: 10 * 60 * 1000, // 10분
            refetchOnWindowFocus: false,
            retry: (failureCount, error: Error) => {
              if (
                'response' in error &&
                typeof error.response === 'object' &&
                error.response !== null &&
                'status' in error.response
              ) {
                const status = (error.response as { status: number }).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 2;
            },
            throwOnError: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* 토스트 알림 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
          },
        }}
      />

      {/* React Query DevTools (개발 환경만) */}
      {env.NEXT_PUBLIC_ENABLE_DEVTOOLS && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default Providers;
