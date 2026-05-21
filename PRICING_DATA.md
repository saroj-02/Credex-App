# Credex Spend Audit - Pricing Reference Database
This reference ledger documents the official product pricing catalogs, tiers, plans, and minimum seat counts for the AI tools integrated within the Credex Spend Audit Engine.

**Last Verified & Updated:** May 21, 2026

---

## 1. Tool Tiers & Seat Pricing

| Tool | Plan | Monthly Cost (USD) | Seat Minimums / Constraints | Verified URL Source |
| :--- | :--- | :--- | :--- | :--- |
| **Cursor** | Hobby | $0 | Unlimited (free usage limits apply) | [Cursor Pricing](https://www.cursor.com/pricing) |
| | Pro | $20 / seat | Single user or multiple users | [Cursor Pricing](https://www.cursor.com/pricing) |
| | Business | $40 / seat | Targeted at teams; includes centralized billing | [Cursor Pricing](https://www.cursor.com/pricing) |
| | Enterprise | $100 / seat | Estimated average negotiated tier cost | [Cursor Contact](https://www.cursor.com/contact) |
| **GitHub Copilot** | Individual | $10 / seat | No seat minimums | [GitHub Copilot Pricing](https://github.com/features/copilot#pricing) |
| | Business | $19 / seat | Multi-seat company environments | [GitHub Copilot Pricing](https://github.com/features/copilot#pricing) |
| | Enterprise | $39 / seat | Custom access, fine-tuning, security policies | [GitHub Copilot Pricing](https://github.com/features/copilot#pricing) |
| **Claude (Anthropic)**| Free | $0 | Direct consumption limits | [Claude Pricing](https://www.anthropic.com/claude) |
| | Pro | $20 / seat | Single-user subscription | [Claude Pro](https://www.anthropic.com/claude) |
| | Team | $30 / seat | **Minimum 5 seats ($150/mo minimum)** | [Claude Team](https://www.anthropic.com/claude) |
| | Enterprise | $75 / seat | Estimated blended average for contract tiers | [Claude Sales](https://www.anthropic.com/claude) |
| **ChatGPT (OpenAI)** | Plus | $20 / seat | Individual subscription | [OpenAI Pricing](https://openai.com/chatgpt/pricing) |
| | Team | $30 / seat | **Minimum 2 seats ($60/mo minimum)** | [OpenAI Team Pricing](https://openai.com/chatgpt/pricing) |
| | Enterprise | $60 / seat | Estimated average for custom commercial pools | [OpenAI Enterprise](https://openai.com/chatgpt/pricing) |
| **Windsurf** | Free | $0 | Free limits apply | [Codeium Windsurf](https://codeium.com/windsurf) |
| | Pro | $15 / seat | Single-seat full power | [Codeium Windsurf](https://codeium.com/windsurf) |
| | Team | $30 / seat | Centralized billing controls | [Codeium Windsurf](https://codeium.com/windsurf) |
| **Gemini (Google)** | Pro | $0 | Free tier API & Web access | [Gemini Pricing](https://deepmind.google/technologies/gemini) |
| | Ultra (Advanced) | $20 / seat | Part of Google One AI Premium | [Gemini Advanced](https://gemini.google.com/advanced) |

---

## 2. API Caching & Usage Heuristics
For direct APIs (Anthropic & OpenAI usage-based consumption):
* **Anthropic Claude API & OpenAI API:** Subject to usage billing. When teams exceed $150/mo, input system prompts represent a massive component of recurring token burn.
* **Context Caching:** Using prompt/context caching reduces prompt inputs by up to 50%-90% on subsequent turns. The Credex Engine estimates a conservative overall **30% monthly savings projection** on raw API usage for organizations exceeding $150/month by utilizing structured context cache integrations.
* **Pricing Verification Source:**
  * [Anthropic Prompt Caching Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
  * [OpenAI Context Caching Documentation](https://platform.openai.com/docs/guides/prompt-caching)
