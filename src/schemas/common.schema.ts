import { z } from 'zod';

/**
 * 공통 스키마 정의
 * - 페이지네이션
 * - API 응답 래퍼
 */

// 페이지네이션 파라미터
export const PaginationParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

// 페이지네이션 응답
export const PaginationResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

// API 성공 응답
export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

// API 에러 응답
export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

// 타입 추론
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginationResponse = z.infer<typeof PaginationResponseSchema>;
