export default function Page() {
  return (
    <main className="container py-8 space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Next Boilerplate</h1>
        <p className="text-sm text-muted-foreground">
          Next.js + TypeScript + Zod + Zustand + React Query + Tailwind v4 + shadcn/ui
        </p>
      </section>

      <section className="rounded-2xl border p-6 shadow-sm max-w-xl space-y-4">
        <p className="text-sm text-muted-foreground">✅ 기술 스택 요약</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Next.js 15 (App Router)</li>
          <li>TypeScript strict + ESLint/Prettier</li>
          <li>Zod — 타입 세이프 데이터 계약</li>
          <li>React Query — 서버 상태 관리</li>
          <li>Zustand — 로컬 상태 관리</li>
          <li>Tailwind v4 — 유틸리티 퍼스트 스타일</li>
          <li>Vitest / Playwright — 테스트 자동화</li>
          <li>release-please — 자동 버전/릴리즈</li>
        </ul>
      </section>
    </main>
  );
}
