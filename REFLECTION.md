# Reflection

## AI Usage Disclosure
This MVP was built using AI assistance (Gemini) strictly to accelerate boilerplate generation (Next.js scaffolding, Tailwind layouts, and standard testing setups). 

**What I delegated to AI:**
- Bootstrapping the Next.js and Tailwind project.
- Generating the initial CSS styles for the dark mode theme.
- Writing boilerplate Jest configuration files.

**What I drove manually:**
- The architectural decision to decouple `calculator.ts` from the UI.
- The funnel metrics strategy and economics modeling.
- The product copy and UX flow (ensuring a frictionless audit experience).

## Challenges & Decisions
One major decision was how to handle the "Cloud Integration" step in an MVP. Building real OAuth flows for AWS/GCP takes days and requires strict security reviews. I chose to mock this flow and ask users for manual usage inputs instead. This constraint forced a simpler UX that still tests the core hypothesis: *will users convert if shown their potential savings?*
