/**
 * Pure functions for calculating cloud savings.
 * Separated from UI for easy testing.
 */

export const calculateAWSSavings = (monthlySpend: number): number => {
    // Migrate to Graviton3 typically saves ~15% on compute
    return monthlySpend * 0.15;
  };
  
  export const calculateAnthropicSavings = (monthlySpend: number): number => {
    // Prompt caching and prompt optimization can save ~20%
    return monthlySpend * 0.20;
  };
  
  export const calculateTotalSavings = (monthlySpend: number): number => {
    return calculateAWSSavings(monthlySpend) + calculateAnthropicSavings(monthlySpend);
  };
  
  export const isEligibleForStartupCredits = (monthlySpend: number): boolean => {
    // Assume startups spending > $500/mo are serious enough to qualify for typical YC/Activate grants
    return monthlySpend >= 500;
  };
