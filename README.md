# Credex MVP

## Setup Instructions

1. Clone the repository.
2. Run `npm install`
3. Run `npm run dev` to start the local development server at `http://localhost:3000`.
4. Run `npm test` to execute the Jest test suite.

## Decisions

- **Framework:** Next.js 14 App Router. Chosen for its blend of static site generation (perfect for the landing page) and client-side interactivity (necessary for the audit flow).
- **Styling:** Tailwind CSS. Enables a sleek, modern UI with minimal custom CSS. We focused heavily on the "Polish in UI" requirement by using dark mode, glassmorphism, and smooth micro-animations.
- **Testing:** Jest + React Testing Library. The business logic (`src/lib/calculator.ts`) is strictly separated from the UI layer to allow fast, reliable unit testing without DOM overhead.

## MVP Features Complete
1. Landing Page (High converting)
2. Interactive "Connect Cloud" Mock Form
3. Usage Parsing / Estimator
4. Savings Calculation Engine
5. Results Dashboard
6. Consultation Booking Form
