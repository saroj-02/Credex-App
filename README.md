# Credex AI Spend Audit

Credex is a highly polished, interactive developer spend audit platform designed to help fast-growing startups optimize their AI subscription costs, eliminate duplicate tooling, and claim up to $100,000 in non-dilutive cloud credits. By evaluating active seat distributions, plan tiers, and direct LLM API usage against actual vendor pricing schemas, the Credex Audit Engine uncovers structural waste and compiles clear, finance-literate optimization reports.

---

## 🚀 Setup & Local Execution

### 1. Installation
Install project dependencies using your package manager:
```bash
npm install
```

### 2. Run the Development Server
Launch the Next.js development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the high-fidelity landing page and 3-step spend audit funnel.

### 3. Run Automated Tests
Execute the unit and integration Jest test suite:
```bash
npm test
```

---

## 🛠️ Key Architectural Decisions

To ensure a premium UX combined with absolute developer privacy, the Credex architecture centers around three core principles:
1. **Decoupled Audit Engine (`src/lib/calculator.ts`):** All mathematical pricing logic, seat minimum penalty heuristics, and optimization rules are written as pure functions isolated from the React DOM. This separation allows instant, dependency-free unit testing.
2. **Zero-Database Anonymized URL Sharing:** To address founder privacy concerns, shared reports serialize active tool selections directly into a Base64 string within the query parameters. When a shared URL is loaded, it decodes and compiles strictly in-memory on the client, removing all personally identifiable information (PII) such as emails and company names.
3. **Resilient Serverless Fallback NLP Summary:** The serverless `/api/audit` endpoint captures leads and returns custom natural-language audit paragraphs. If external LLM API keys are absent, a highly robust, deterministic NLP syntax builder instantly compiles a customized financial summary of equivalent caliber in under `< 1ms`.

---

## 📂 Repository Documentation Structure
* **`ARCHITECTURE.md`**: Systems architecture mapping the multi-step frontend to the serverless parser logic via a Mermaid diagram.
* **`PRICING_DATA.md`**: Verified May 2026 pricing logs, minimum constraints, and vendor URLs.
* **`PROMPTS.md`**: LLM prompt engineering sheets, system rules, and deterministic NLP fallback code structures.
* **`TESTS.md`**: Detailed test specs, mock definitions, and verification commands.
* **`GTM.md`**: $0 budget growth channels, acquisition timelines, and viral referral loops.
* **`ECONOMICS.md`**: LTV:CAC frameworks, monetizing models, and 18-month $1M ARR projections.
* **`USER_INTERVIEWS.md`**: Transcripts of three target developer interviews and the UX adjustments they drove.
* **`LANDING_COPY.md`**: Landing copywriting manuals and a 5-part customer FAQ database.
* **`METRICS.md`**: North Star metric (Total Activated Savings) definitions and conversion funnels.
* **`DEVLOG.md`**: 7-day daily development cycle and git log.
* **`REFLECTION.md`**: Post-mortem interview answers reflecting on engineering trade-offs.
