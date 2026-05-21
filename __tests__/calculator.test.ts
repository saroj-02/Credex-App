import { 
  runSpendAudit, 
  calculateAWSSavings, 
  calculateAnthropicSavings, 
  calculateTotalSavings, 
  isEligibleForStartupCredits 
} from '../src/lib/calculator';

describe('AI Spend Audit Engine (runSpendAudit)', () => {
  
  it('1. Should detect and cancel redundant GitHub Copilot if Cursor is also active', () => {
    const stack = [
      { name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 },
      { name: 'GitHub Copilot', plan: 'Individual', monthlySpend: 10, seats: 1 }
    ];
    const report = runSpendAudit(stack, 1, 'coding');
    
    // Total current spend = $30
    expect(report.totalCurrentSpend).toBe(30);
    
    // GitHub Copilot result should recommend "Cancel"
    const copilotResult = report.results.find(r => r.toolName === 'GitHub Copilot');
    expect(copilotResult).toBeDefined();
    expect(copilotResult?.action).toBe('Cancel');
    expect(copilotResult?.recommendedSpend).toBe(0);
    expect(copilotResult?.savings).toBe(10);
    
    // Total savings should be $10
    expect(report.totalSavings).toBe(10);
    expect(report.totalRecommendedSpend).toBe(20);
  });

  it('2. Should identify Claude Team plan 5-seat minimum penalty and recommend Pro downgrade', () => {
    // Claude Team requires a minimum of 5 seats ($150/mo total). Let's simulate a user with 2 seats who was paying the $150 minimum.
    const stack = [
      { name: 'Claude', plan: 'Team', monthlySpend: 150, seats: 2 }
    ];
    const report = runSpendAudit(stack, 2, 'mixed');
    
    const claudeResult = report.results.find(r => r.toolName === 'Claude');
    expect(claudeResult).toBeDefined();
    expect(claudeResult?.action).toBe('Downgrade');
    expect(claudeResult?.recommendedPlan).toBe('Pro');
    // Recommended spend: 2 seats * $20/mo (Claude Pro) = $40
    expect(claudeResult?.recommendedSpend).toBe(40);
    expect(claudeResult?.savings).toBe(110);
    expect(report.totalSavings).toBe(110);
  });

  it('3. Should identify ChatGPT Team plan 2-seat minimum penalty and recommend Plus downgrade', () => {
    // ChatGPT Team requires a minimum of 2 seats ($60/mo). A user has 1 seat and pays the $60 minimum.
    const stack = [
      { name: 'ChatGPT', plan: 'Team', monthlySpend: 60, seats: 1 }
    ];
    const report = runSpendAudit(stack, 1, 'writing');
    
    const chatGptResult = report.results.find(r => r.toolName === 'ChatGPT');
    expect(chatGptResult).toBeDefined();
    expect(chatGptResult?.action).toBe('Downgrade');
    expect(chatGptResult?.recommendedPlan).toBe('Plus');
    // Recommended: 1 * $20/mo (ChatGPT Plus) = $20
    expect(chatGptResult?.recommendedSpend).toBe(20);
    expect(chatGptResult?.savings).toBe(40);
  });

  it('4. Should recommend Cursor Business to Pro downgrade for tiny teams of 1-2 users', () => {
    const stack = [
      { name: 'Cursor', plan: 'Business', monthlySpend: 40, seats: 1 }
    ];
    const report = runSpendAudit(stack, 1, 'coding');
    
    const cursorResult = report.results.find(r => r.toolName === 'Cursor');
    expect(cursorResult).toBeDefined();
    expect(cursorResult?.action).toBe('Downgrade');
    expect(cursorResult?.recommendedPlan).toBe('Pro');
    expect(cursorResult?.recommendedSpend).toBe(20);
    expect(cursorResult?.savings).toBe(20);
  });

  it('5. Should suggest context caching optimization for high API usage', () => {
    const stack = [
      { name: 'Anthropic API direct', plan: 'Usage-based', monthlySpend: 500, seats: 1 }
    ];
    const report = runSpendAudit(stack, 5, 'mixed');
    
    const apiResult = report.results.find(r => r.toolName === 'Anthropic API direct');
    expect(apiResult).toBeDefined();
    expect(apiResult?.action).toBe('Optimize API');
    // Recommended spend = 70% of current spend = $350 (30% savings)
    expect(apiResult?.recommendedSpend).toBe(350);
    expect(apiResult?.savings).toBe(150);
  });

  it('6. Should recommend cancelling ChatGPT if Claude is also active and usecase is purely coding', () => {
    const stack = [
      { name: 'Claude', plan: 'Pro', monthlySpend: 20, seats: 1 },
      { name: 'ChatGPT', plan: 'Plus', monthlySpend: 20, seats: 1 }
    ];
    const report = runSpendAudit(stack, 1, 'coding');
    
    const chatGptResult = report.results.find(r => r.toolName === 'ChatGPT');
    expect(chatGptResult).toBeDefined();
    expect(chatGptResult?.action).toBe('Cancel');
    expect(chatGptResult?.recommendedPlan).toBe('None');
    expect(chatGptResult?.savings).toBe(20);
  });

  it('7. Should verify that already optimal stacks recommend keeping the current plan', () => {
    const stack = [
      { name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }
    ];
    const report = runSpendAudit(stack, 1, 'coding');
    
    const cursorResult = report.results.find(r => r.toolName === 'Cursor');
    expect(cursorResult).toBeDefined();
    expect(cursorResult?.action).toBe('Keep');
    expect(cursorResult?.savings).toBe(0);
    expect(report.totalSavings).toBe(0);
  });
});

describe('Legacy Savings Calculator Compatibility Checks', () => {
  it('should verify backward compatibility values continue to pass', () => {
    expect(calculateAWSSavings(1000)).toBe(150);
    expect(calculateAnthropicSavings(5000)).toBe(1000);
    expect(calculateTotalSavings(1000)).toBe(350);
    expect(isEligibleForStartupCredits(499)).toBe(false);
    expect(isEligibleForStartupCredits(500)).toBe(true);
  });
});
