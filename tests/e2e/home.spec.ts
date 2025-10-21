import { test, expect } from '@playwright/test';

test('홈 페이지 렌더 & 기본 텍스트', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Next Boilerplate');
  await expect(
    page.getByText('Next.js + TypeScript + Zod + Zustand + React Query + Tailwind v4 + shadcn/ui'),
  ).toBeVisible();
});

test('헬스 체크 API', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json).toEqual({ ok: true });
});
