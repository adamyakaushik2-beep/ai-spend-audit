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

  // We use teamSize and useCase here to make decisions
  const isSmallTeam = teamSize < 10;
  const isCodingFocus = useCase === 'coding' || useCase === 'mixed';

  tools.forEach((tool) => {
    // Logic 1: Cursor optimization for small teams
    if (tool.name === 'Cursor' && isSmallTeam && tool.seats < 3) {
      results.push({
        toolName: 'Cursor',
        recommendation: 'Switch to Pro',
        monthlySavings: 20 * tool.seats,
        reason: `For a small team of ${teamSize}, the Business tier features are likely unnecessary.`
      });
    }

    // Logic 2: Consolidating ChatGPT if the team is coding-focused
    if (tool.name === 'ChatGPT' && isCodingFocus) {
      // Find if they also have Claude
      const hasClaude = tools.find(t => t.name === 'Claude');
      if (hasClaude) {
        results.push({
          toolName: 'ChatGPT',
          recommendation: 'Consolidate to Claude',
          monthlySavings: tool.monthlySpend,
          reason: `Since your focus is ${useCase}, Claude 3.5 Sonnet is sufficient. You can drop ChatGPT.`
        });
      }
    }
  });

  return results;
}
