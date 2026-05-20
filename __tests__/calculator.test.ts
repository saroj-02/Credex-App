import { calculateAWSSavings, calculateAnthropicSavings, calculateTotalSavings, isEligibleForStartupCredits } from '../src/lib/calculator';

describe('Savings Calculator Engine', () => {
  it('should correctly calculate AWS Graviton3 savings (15%)', () => {
    expect(calculateAWSSavings(1000)).toBe(150);
    expect(calculateAWSSavings(5000)).toBe(750);
  });

  it('should correctly calculate Anthropic token routing savings (20%)', () => {
    expect(calculateAnthropicSavings(1000)).toBe(200);
    expect(calculateAnthropicSavings(5000)).toBe(1000);
  });

  it('should calculate total combined savings accurately', () => {
    expect(calculateTotalSavings(1000)).toBe(350);
  });

  it('should determine startup credit eligibility correctly', () => {
    expect(isEligibleForStartupCredits(499)).toBe(false);
    expect(isEligibleForStartupCredits(500)).toBe(true);
    expect(isEligibleForStartupCredits(10000)).toBe(true);
  });
});
