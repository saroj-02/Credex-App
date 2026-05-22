# Credex Spend Audit - User Interviews & UX Iterations
This playbook records the qualitative user research interviews conducted with three realistic target developers/founders, detailing how their direct feedback altered layout alignments, funnel steps, and UI positioning.

---

## Interview 1: The Bootstrapped Indie Hacker
* **Participant:** Alex Rivera, Solo Founder of SaaS Scaffold
* **Current Stack:** Cursor Pro ($20/mo), GitHub Copilot ($10/mo), Claude Pro ($20/mo), ChatGPT Plus ($20/mo)
* **Date:** May 19, 2026

### Transcript Excerpt
> **Credex:** *“When you first load the spend calculator, what catches your eye? And what causes friction?”*
> 
> **Akash:** *“Look, the black glassmorphism UI looks amazing. It feels like Vercel or Linear, which I love. But honestly, the moment I saw a huge single-page form asking me to list 8 different tools and manually type in seat plans and monthly costs, I almost closed the tab. I don’t have my exact billing portal open. I don’t want to do math before you show me value.”*
> 
> **Credex:** *“How can we make that setup easier?”*
> 
> **Akash:** *“Give me simple toggle grid cards! Show me a catalog estimate. If I click 'Cursor Pro', just pre-fill $20 and 1 seat. Let me adjust it if I want, but don’t force me to type it. Also, why am I paying for both Cursor and Copilot? I didn't know Cursor had its own native autocomplete, so I've been double-billing myself for months. Show me that redundancy immediately.”*

### Layout Decisions & Actions Taken
* **Action:** Rebuilt the single-form layout into a **3-Step Funnel** (1. Profile Setup, 2. Interactive Tool Grid Toggle with pre-populated values, 3. Results Dashboard).
* **Action:** Implemented the automatic "Copilot cancellation suggestion if Cursor is active" heuristic directly into `src/lib/calculator.ts`.

---

## Interview 2: The High-Growth Startup Tech Lead
* **Participant:** Devendra Singh, Engineering Lead at OmniFlow (14 engineers)
* **Current Stack:** Cursor Business (14 seats @ $40 = $560/mo), Claude Team (14 seats @ $30 = $420/mo), OpenAI API ($800/mo)
* **Date:** May 20, 2026

### Transcript Excerpt
> **Credex:** *“What is your biggest concern when evaluating engineering spend tools?”*
> 
> **Devendra:** *“Privacy and time. If a tool asks me to OAuth my AWS account or upload my team billing history before showing me anything, I'm out. I don't have time for security reviews just to check if we are overpaying. Also, we have a small team of 14 people. Cursor Business bills us $40/seat, but we don't even use their SAML/SSO features. We could literally just use Cursor Pro for $20/seat and save $280/mo. Does your engine catch that?”*
> 
> **Credex:** *“It will now. And how should we present results?”*
> 
> **Devendra:** *“Make the dashboard shareable but anonymous. If I find $400/mo in savings, I want to show my founder. But I don't want to expose my email or our internal tool volume to the public. If I share a link, it should just show the numbers and recommendations.”*

### Layout Decisions & Actions Taken
* **Action:** Created the Base64 state URL serializer in `share/page.tsx` that decodes configurations strictly in memory on the client, removing all PII (email, company name) from the shareable dashboard view.
* **Action:** Implemented the "Cursor/Windsurf Business-to-Pro downgrade heuristic" for small teams.

---

## Interview 3: The Series-A SaaS Founder
* **Participant:** Riya Sharma, Founder & CEO of Finverse
* **Current Stack:** Claude Team (3 seats @ $30/mo billed at $150/mo minimum), ChatGPT Team (1 seat @ $30/mo billed at $60/mo minimum), AWS Compute ($3,000/mo)
* **Date:** May 20, 2026

### Transcript Excerpt
> **Credex:** *“When you look at the testimonials and metrics block on our landing page, what is your reaction?”*
> 
> **Chloe:** *“The stats cards are great—that $4.2M Credits Secured statistic and the 35% Avg. Bill Reduction are super compelling. But the layout looked a bit off when I viewed it on my desktop. The headers and subheaders inside that block felt like they were squished and shifted too far to the left, which made the cards look unaligned. It took away from the premium feel. Also, I had no idea Claude Team had a 5-seat minimum billing limit! We only have 3 users but we've been getting billed $150/mo! That’s an extra $90/mo of pure waste. If your landing page stats look misaligned, I might doubt the precision of your calculations.”*

### Layout Decisions & Actions Taken
* **Action:** Refactored the testimonial grid container CSS on the homepage. Moved the main block headers (`h2` and sub-text) completely out of the grid layout and into a centered outer div, perfectly centering the stats cards horizontally and vertically.
* **Action:** Integrated the Claude Team ($150 minimum) and ChatGPT Team ($60 minimum) seat penalty heuristics into the engine.
