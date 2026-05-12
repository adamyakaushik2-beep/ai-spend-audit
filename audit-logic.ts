export interface ToolInput {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditResult {
  toolName: string;
  recommendation: string;
  monthlySavings: number;
  reason: string;
}

export function runAudit(tools: ToolInput[], teamSize: number, useCase: string): AuditResult[] {
  const results: AuditResult[] = [];

  // Trap 1: GitHub Copilot Business for very small teams
  // Business is $19/mo, Individual is $10/mo.
  const copilot = tools.find(t => t.name === 'GitHub Copilot');
  if (copilot && copilot.plan.toLowerCase().includes('business') && copilot.seats < 5) {
    results.push({
      toolName: 'GitHub Copilot',
      recommendation: 'Switch to Individual Plans',
      monthlySavings: 9 * copilot.seats,
      reason: `For teams under 5, Individual seats ($10/mo) provide the same coding features as Business ($19/mo) without the enterprise overhead.`
    });
  }

  // Trap 2: Claude Team Minimums
  // Claude Team usually requires a 5-seat minimum ($25/mo/seat).
  // If someone has 1 seat on "Team," they are effectively paying $125/mo.
  const claude = tools.find(t => t.name === 'Claude');
  if (claude && claude.plan.toLowerCase().includes('team') && claude.seats < 5) {
    results.push({
      toolName: 'Claude',
      recommendation: 'Switch to Claude Pro',
      monthlySavings: Math.max(0, claude.monthlySpend - 20),
      reason: `Claude Team has a 5-seat minimum. A single Pro subscription ($20/mo) is more cost-effective for solo users.`
    });
  }

  // Trap 3: Cursor "Business" Overkill
  const cursor = tools.find(t => t.name === 'Cursor');
  if (cursor && cursor.plan.toLowerCase().includes('business') && cursor.seats < 3) {
    results.push({
      toolName: 'Cursor',
      recommendation: 'Switch to Pro',
      monthlySavings: (40 - 20) * cursor.seats,
      reason: `Business pricing ($40) is double the Pro price ($20). Small teams rarely utilize the SAML/SSO features included in Business.`
    });
  }

  // Trap 4: Model Redundancy (The "Duplicate Brain" Tax)
  // If they pay for BOTH ChatGPT and Claude and they are a "Coding" team
  const hasChatGPT = tools.find(t => t.name === 'ChatGPT');
  const hasClaude = tools.find(t => t.name === 'Claude');
  if (hasChatGPT && hasClaude && useCase === 'coding') {
    results.push({
      toolName: 'Consolidation',
      recommendation: 'Drop ChatGPT Plus',
      monthlySavings: hasChatGPT.monthlySpend,
      reason: `For coding-heavy teams, Claude 3.5 Sonnet is currently superior. You can likely eliminate ChatGPT to save ${hasChatGPT.monthlySpend}/mo.`
    });
  }

  // Trap 5: High API Spend vs Subscriptions
  // If someone spends >$50 on API but is just doing "Writing" or "Research"
  tools.forEach(tool => {
    if (tool.name.toLowerCase().includes('api') && tool.monthlySpend > 50 && (useCase === 'writing' || useCase === 'research')) {
      results.push({
        toolName: tool.name,
        recommendation: 'Switch to a Pro Subscription',
        monthlySavings: tool.monthlySpend - 20,
        reason: `Your API spend is high for manual tasks. A flat $20/mo subscription for ChatGPT or Claude would be cheaper.`
      });
    }
  });

  return results;
}
