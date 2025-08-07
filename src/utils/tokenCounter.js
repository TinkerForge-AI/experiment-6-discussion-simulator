// Token management utility
// Accurate token estimation using character count heuristics
function countTokens(text) {
  // Estimate: 1 token ≈ 4 characters (OpenAI/Gemini heuristic)
  return Math.ceil(text.length / 4);
}

class TokenBudget {
  constructor(maxTokens = 2000) {
    this.maxTokens = maxTokens;
    this.allocations = {}; // personaId -> tokens allocated
    this.warnings = [];
  }

  allocate(personaId, tokens) {
    if (!this.allocations[personaId]) this.allocations[personaId] = 0;
    this.allocations[personaId] += tokens;
    this._checkWarning(personaId);
  }

  adjustBudget(personaId, complexityScore) {
    // Dynamic adjustment: more complex, more tokens
    const base = 512;
    this.allocations[personaId] = base + Math.floor(complexityScore * 100);
    this._checkWarning(personaId);
  }

  _checkWarning(personaId) {
    if (this.allocations[personaId] > this.maxTokens * 0.9) {
      this.warnings.push(`Warning: ${personaId} is approaching token limit!`);
    }
  }

  getWarnings() {
    return [...this.warnings];
  }

  identifyLowValueContent(responses) {
    // Simple: find responses < 10 tokens
    return responses.filter(r => countTokens(r.content) < 10);
  }

  integrateWithMetrics(metricsCollector) {
    // Example: add token usage to metrics
    for (const personaId in this.allocations) {
      metricsCollector.tokenUsage[personaId] = metricsCollector.tokenUsage[personaId] || [];
      metricsCollector.tokenUsage[personaId].push({ tokens: this.allocations[personaId] });
    }
  }
}

module.exports = {
  countTokens,
  TokenBudget
};
