/**
 * 환경변수 타입 정의 및 검증 (Next.js 버전)
 * - 빌드 타임: TS 타입 검사
 * - 런타임: 실제 값 검증
 */

import { z } from 'zod';

/**
 * 환경변수 스키마 정의
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url('NEXT_PUBLIC_API_BASE_URL가 올바른 URL 형식이어야 합니다.')
    .default('http://localhost:3000/api'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_ENABLE_DEVTOOLS: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  NEXT_PUBLIC_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

/**
 * 환경변수 검증 및 파싱
 * - 서버/클라이언트 공용 사용 가능
 */
const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  });

  if (!parsed.success) {
    console.error('❌ 환경변수 검증 실패:', parsed.error.flatten());
    throw new Error('환경변수 설정을 확인해주세요 (.env.local)');
  }

  return parsed.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
