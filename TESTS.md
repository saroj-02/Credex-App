# Credex Spend Audit - Test Suite Documentation
This document outlines the testing strategy, test coverage, and execution commands for the Credex Spend Audit application.

---

## 1. Test Suite Architecture
The codebase separates business logic from React views, enabling highly robust unit and integration testing:
1. **Engine Logic (`src/lib/calculator.ts`):** Evaluated via pure function Jest tests in `__tests__/calculator.test.ts`. This requires zero browser overhead and completes in milliseconds.
2. **React Page Logic (`src/app/page.tsx`):** Evaluated via React Testing Library inside `__tests__/Landing.test.tsx` to verify standard component rendering, page structure, and buttons.

---

## 2. Test Cases Overview

### A. Spend Audit Heuristics (`calculator.test.ts`)
* **Test 1: Redundant Tool Check (Cursor + Copilot):** Validates that if a team runs Cursor and GitHub Copilot simultaneously, the engine recommends cancelling Copilot and returns a 100% savings on its plan, removing double-pay waste.
* **Test 2: Claude Team Minimum Seats penalty:** Verifies that teams using fewer than 5 seats on the Claude Team plan ($30/seat but a 5-seat/$150/mo minimum) are recommended to downgrade to Claude Pro ($20/seat), removing the seat minimum penalty.
* **Test 3: ChatGPT Team Minimum Seats penalty:** Verifies that teams with a single user on ChatGPT Team ($30/seat but a 2-seat/$60/mo minimum) are recommended to downgrade to ChatGPT Plus ($20/mo), removing the 2-seat minimum.
* **Test 4: Cursor Business to Pro Downgrade:** Assures that tiny teams of 1-2 users on Cursor Business ($40/seat) are recommended to downgrade to Cursor Pro ($20/seat) to bypass the administrative panel premium.
* **Test 5: Prompt Caching Optimizer (API direct):** Confirms that if a team spends $\ge \$150/\text{mo}$ on direct Anthropic/OpenAI APIs, the engine suggests Context Caching and estimates a **30% monthly reduction** in token costs.
* **Test 6: Over-bundling assistant consolidation:** Confirms that purely coding teams subscribing to both Claude and ChatGPT are recommended to cancel ChatGPT, as Claude is mathematically superior for coding tasks.
* **Test 7: Already Optimal Stacks:** Ensures that already optimal tool stacks are recommended to remain on their existing plan (`Keep` action) with $0/mo savings.
* **Test 8: Legacy compatibility:** Assures that legacy math functions (`calculateAWSSavings`, `calculateAnthropicSavings`, `calculateTotalSavings`, `isEligibleForStartupCredits`) remain consistent and functional to preserve backward compatibility.

### B. Marketing Views (`Landing.test.tsx`)
* **Test 9: Hero Headline Rendering:** Verifies that the primary marketing copy "Stop overpaying for AI compute" appears correctly.
* **Test 10: CTA Button Visibility:** Verifies that the primary action buttons "Run Audit" and "Run Free Infrastructure Audit" are fully rendered.

---

## 3. How to Run the Tests

### Prerequisites
Make sure dependencies are installed:
```bash
npm install
```

### Run All Tests
Execute the main Jest runner:
```bash
npm test
```

### Run with Coverage
Generate a detailed test coverage report:
```bash
npx jest --coverage
```
