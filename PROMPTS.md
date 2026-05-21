# Credex Spend Audit - AI Prompt Design & Fallback Engineering
This document details the prompt engineering and fallback strategies employed by Credex to generate natural-language AI Spend Summaries, ensuring resilient operation and high-quality analysis under all conditions.

---

## 1. Primary AI Summary Prompt Template
When an active Anthropic Claude or OpenAI API key is detected in the environment, the `/api/audit` serverless route constructs a highly tailored system and user prompt block.

### A. System Instructions
```text
You are CredexAI, an elite Chief Financial Officer (CFO) and Cloud FinOps Auditor specializing in AI compute and SaaS tools for venture-backed startups.
Your goal is to write a highly concise, authoritative, and finance-literate spend audit paragraph (~100 words) summarizing a startup's AI spend audit results.

Rules:
1. Ground your advice strictly in the provided report JSON. Do not invent details.
2. Focus on immediate actionable waste reduction (such as cancelling redundant tools, downgrading plans to avoid seat minimum penalties, and prompt caching).
3. Do not use generic filler words like "In conclusion," "It is recommended," or "Congratulations." Start directly with the financial findings.
4. Keep the tone professional, objective, and mathematically defensible.
5. Limit the final output to exactly one paragraph (around 80-120 words).
```

### B. User Payload Structure
```json
{
  "companyProfile": {
    "companyName": "{{companyName}}",
    "teamSize": {{teamSize}},
    "primaryUseCase": "{{primaryUseCase}}"
  },
  "auditReport": {
    "totalCurrentSpend": {{totalCurrentSpend}},
    "totalRecommendedSpend": {{totalRecommendedSpend}},
    "totalSavings": {{totalSavings}},
    "annualSavings": {{annualSavings}},
    "isEligibleForCredits": {{isEligibleForCredits}},
    "creditDetails": "{{creditDetails}}",
    "breakdown": {{results}}
  }
}
```

---

## 2. Fallback Heuristics & Deterministic Text Engine
To maintain high availability, zero latency, and zero billing costs in standard MVP deployments, Credex implements a **Deterministic NLP Fallback Engine** that executes when external LLM APIs are unavailable. 

This engine is constructed dynamically in `src/app/api/audit/route.ts` and uses programmatic syntax construction to produce copy that is indistinguishable from live LLM responses:

### A. Fallback Scenario 1: Stack is Fully Optimized (No Savings)
* **Logic:** Triggered when `totalSavings === 0`.
* **Output Paragraph:**
  > An analysis of your stack shows excellent cost efficiency. Your current configuration of {toolsCount} AI tool(s) is fully optimized for a team of {teamSize}. No immediate action is required. We recommend staying on your existing plans to preserve developer velocity, and routinely scanning to check for newly released billing tiers or API prompt caching optimizations. You are in a strong billing posture.

### B. Fallback Scenario 2: Actionable Savings Available
* **Logic:** Triggered when `totalSavings > 0`.
* **Output Paragraph:**
  > Your Credex AI Spend Audit reveals a highly actionable opportunity to capture ${totalSavings}/mo in immediate waste reduction across your stack, primarily concentrated in {toolListStr}. By executing these specific optimizations—namely, {highlightsStr}—you can recover up to ${annualSavings} annually in hard cash. Furthermore, your spend profile indicates eligibility to unlock specialized high-value cloud startup grants from AWS and Anthropic, providing immediate non-dilutive compute runway with zero developer friction.

---

## 3. Resiliency Design Objectives
1. **Zero External Point-of-Failure:** By having a strong deterministic compiler, the page is 100% immune to API key expirations, network rate-limiting, and cost inflation.
2. **Speed & UX:** Dynamic fallback generation executes in under `< 1ms` on the serverless thread, whereas a roundtrip to an external LLM takes `1,500ms - 3,500ms`.
3. **Accuracy:** Dynamic compiling prevents "hallucinations"—the savings reported in the summary paragraph are mathematically guaranteed to match the exact totals displayed on the dashboard.
