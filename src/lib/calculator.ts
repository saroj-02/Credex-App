/**
 * Pure functions for calculating AI spend savings and audits.
 * Strictly separated from the UI for ease of unit testing.
 * Pricing updated as of May 2026.
 */

export interface ToolInput {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditResult {
  toolName: string;
  currentSpend: number;
  recommendedSpend: number;
  recommendedPlan: string;
  savings: number;
  action: 'Keep' | 'Downgrade' | 'Optimize API' | 'Migrate' | 'Cancel' | 'Unify';
  reason: string;
}

export interface AuditReport {
  results: AuditResult[];
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalSavings: number;
  annualSavings: number;
  isEligibleForCredits: boolean;
  creditDetails: string;
}

// Pricing Database as of submission week
export const PRICING_DB: Record<string, Record<string, number>> = {
  'Cursor': {
    'Hobby': 0,
    'Pro': 20,
    'Business': 40,
    'Enterprise': 100, // estimated custom average
  },
  'GitHub Copilot': {
    'Individual': 10,
    'Business': 19,
    'Enterprise': 39,
  },
  'Claude': {
    'Free': 0,
    'Pro': 20,
    'Max': 0,
    'Team': 30, // Requires minimum 5 seats ($150/mo)
    'Enterprise': 75, // custom average
    'API direct': -1, // usage-based
  },
  'ChatGPT': {
    'Plus': 20,
    'Team': 30, // Requires minimum 2 seats ($60/mo)
    'Enterprise': 60, // custom average
    'API direct': -1, // usage-based
  },
  'Anthropic API direct': {
    'Usage-based': -1,
  },
  'OpenAI API direct': {
    'Usage-based': -1,
  },
  'Gemini': {
    'Pro': 0,
    'Ultra': 20,
    'API': -1,
  },
  'Windsurf': {
    'Free': 0,
    'Pro': 15,
    'Team': 30,
  }
};

/**
 * Executes a full audit report on the user's AI stack.
 */
export function runSpendAudit(
  tools: ToolInput[],
  teamSize: number,
  primaryUseCase: string
): AuditReport {
  const results: AuditResult[] = [];
  
  // Track active tools to detect redundancies
  const activeToolNames = new Set(tools.map(t => t.name));
  
  // 1. Redundancy check: Cursor + GitHub Copilot
  const hasCursor = activeToolNames.has('Cursor');
  const hasWindsurf = activeToolNames.has('Windsurf');

  for (const tool of tools) {
    let currentSpend = tool.monthlySpend;
    let recommendedSpend = currentSpend;
    let recommendedPlan = tool.plan;
    let action: AuditResult['action'] = 'Keep';
    let reason = 'Your plan is currently optimal for your size and use case.';

    // Base calculations on catalog prices if spend is unspecified or zero
    const basePricePerSeat = PRICING_DB[tool.name]?.[tool.plan] ?? -1;
    if (currentSpend <= 0 && basePricePerSeat > 0) {
      currentSpend = basePricePerSeat * tool.seats;
      recommendedSpend = currentSpend;
    }

    // Heuristic A: Cancel redundant Copilot if Cursor or Windsurf is present
    if (tool.name === 'GitHub Copilot' && (hasCursor || hasWindsurf)) {
      recommendedSpend = 0;
      recommendedPlan = 'None';
      action = 'Cancel';
      reason = hasCursor
        ? 'You are active on both Cursor and Copilot. Cursor includes its own state-of-the-art native autocomplete. Cancelling Copilot removes double-pay waste.'
        : 'You are active on both Windsurf and Copilot. Windsurf features its own native autocomplete engine. Cancelling Copilot saves double-pay fees.';
    }

    // Heuristic B: Claude Team minimum seat overpay
    else if (tool.name === 'Claude' && tool.plan === 'Team' && tool.seats < 5) {
      // Claude Team costs $30/mo but has a 5-seat minimum, so they are billed at least $150/mo.
      const actualBillingSeats = Math.max(5, tool.seats);
      const currentBilledAmount = currentSpend > 0 ? currentSpend : actualBillingSeats * 30;
      
      // Downgrade to Pro ($20/seat/mo)
      recommendedPlan = 'Pro';
      recommendedSpend = tool.seats * 20;
      action = 'Downgrade';
      reason = `Claude Team requires a minimum of 5 seats ($150/mo). Downgrading your ${tool.seats} user(s) to Claude Pro saves $10/user/mo plus removes the 5-seat penalty.`;
      
      // Override currentSpend if it was default
      currentSpend = currentBilledAmount;
    }

    // Heuristic C: ChatGPT Team minimum seat overpay
    else if (tool.name === 'ChatGPT' && tool.plan === 'Team' && tool.seats < 2) {
      // ChatGPT Team costs $30/mo but has a 2-seat minimum ($60/mo).
      const actualBillingSeats = Math.max(2, tool.seats);
      const currentBilledAmount = currentSpend > 0 ? currentSpend : actualBillingSeats * 30;

      // Downgrade to Plus ($20/mo)
      recommendedPlan = 'Plus';
      recommendedSpend = tool.seats * 20;
      action = 'Downgrade';
      reason = `ChatGPT Team has a 2-seat minimum ($60/mo). Downgrading your single user to ChatGPT Plus saves you $10/month and lifts the seat minimum.`;

      currentSpend = currentBilledAmount;
    }

    // Heuristic D: Cursor Business to Pro for tiny teams
    else if (tool.name === 'Cursor' && tool.plan === 'Business' && tool.seats <= 2) {
      recommendedPlan = 'Pro';
      recommendedSpend = tool.seats * 20;
      action = 'Downgrade';
      reason = `For teams of 1-2 users, Cursor Pro provides identical coding capabilities as Business without the $20/seat/month administrative panel premium.`;
    }

    // Heuristic E: Windsurf Team to Pro for tiny teams
    else if (tool.name === 'Windsurf' && tool.plan === 'Team' && tool.seats <= 2) {
      recommendedPlan = 'Pro';
      recommendedSpend = tool.seats * 15;
      action = 'Downgrade';
      reason = `For 1-2 users, Windsurf Pro ($15/mo) offers full IDE capabilities without the $30/mo Team tier administrative premium.`;
    }

    // Heuristic F: API direct prompt caching optimizations
    else if ((tool.name === 'Anthropic API direct' || tool.name === 'OpenAI API direct') && currentSpend >= 150) {
      recommendedSpend = currentSpend * 0.70; // 30% savings estimation
      action = 'Optimize API';
      reason = `Your API usage exceeds $150/mo. Enabling Context Caching for system prompts on ${tool.name} reduces input token costs by up to 50%-90%, yielding ~30% total savings.`;
    }

    // Heuristic G: Chat Assistant Over-bundling (Multi-assistant consolidation)
    // If they have ChatGPT Plus/Team AND Claude Pro/Team, they are paying for both.
    // If their use case is purely "coding", they should use Claude. If mixed/writing, ChatGPT is fine.
    else if (tool.name === 'ChatGPT' && activeToolNames.has('Claude') && primaryUseCase === 'coding') {
      recommendedPlan = 'None';
      recommendedSpend = 0;
      action = 'Cancel';
      reason = 'Your primary use case is coding and you have active subscriptions to both Claude and ChatGPT. Claude is superior for coding; cancel ChatGPT to save fees.';
    }

    results.push({
      toolName: tool.name,
      currentSpend,
      recommendedSpend,
      recommendedPlan,
      savings: Math.max(0, currentSpend - recommendedSpend),
      action,
      reason
    });
  }

  // Calculate Aggregates
  const totalCurrentSpend = results.reduce((acc, r) => acc + r.currentSpend, 0);
  const totalRecommendedSpend = results.reduce((acc, r) => acc + r.recommendedSpend, 0);
  const totalSavings = Math.max(0, totalCurrentSpend - totalRecommendedSpend);
  const annualSavings = totalSavings * 12;

  // Credit eligibility: Startups spending > $200/mo on AI are eligible for significant startup credit programs
  const isEligibleForCredits = totalCurrentSpend >= 200;
  let creditDetails = 'Your current monthly spend is low. Apply for standard cloud provider free tiers.';
  if (isEligibleForCredits) {
    creditDetails = 'Eligible for up to $100k AWS Activate credits, $100k Google Cloud for Startups, and $50k Anthropic API startup token grants.';
  }

  return {
    results,
    totalCurrentSpend,
    totalRecommendedSpend,
    totalSavings,
    annualSavings,
    isEligibleForCredits,
    creditDetails
  };
}

// Keep old legacy functions to maintain full backward compatibility for previous builds
export const calculateAWSSavings = (monthlySpend: number): number => {
  return monthlySpend * 0.15;
};

export const calculateAnthropicSavings = (monthlySpend: number): number => {
  return monthlySpend * 0.20;
};

export const calculateTotalSavings = (monthlySpend: number): number => {
  return calculateAWSSavings(monthlySpend) + calculateAnthropicSavings(monthlySpend);
};

export const isEligibleForStartupCredits = (monthlySpend: number): boolean => {
  return monthlySpend >= 500;
};
