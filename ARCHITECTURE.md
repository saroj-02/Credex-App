# Architecture

## System Design
Credex MVP is built as a highly responsive, client-heavy Next.js (App Router) application. This architecture was chosen for:
1. **Speed of iteration:** React + Tailwind allows rapid prototyping of high-fidelity UIs.
2. **SEO & Performance:** Next.js Server Components (used on the Landing page) ensure fast LCP and strong SEO for the marketing site.
3. **State Management:** The Audit flow (`/audit`) uses client-side state (`useState`) to manage the multi-step funnel. This avoids unnecessary server roundtrips for a purely presentation-layer MVP.

## Component Boundaries
- `src/app/page.tsx`: Server component for marketing. Completely static, highly optimized.
- `src/app/audit/page.tsx`: Client component holding complex funnel state.
- `src/lib/calculator.ts`: The core business logic is decoupled from React components. This is a crucial architectural decision because it allows the savings logic to be unit-tested in isolation (pure functions) without mounting the DOM.

## Future Scaling
When moving beyond the MVP, the `calculator.ts` logic will move to a secure backend API (`/api/audit`) to prevent exposing proprietary cost-optimization algorithms to the client. The frontend will shift to a standard data-fetching architecture using React Query or Server Actions.
