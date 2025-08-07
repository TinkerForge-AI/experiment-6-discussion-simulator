// MetricsCollector for discussion analytics
const fs = require('fs');

class MetricsCollector {
  constructor() {
    this.apiCalls = 0;
    this.tokenUsage = {};
    this.roundTimes = [];
    this.consensusPoints = 0;
    this.divergencePoints = 0;
    this.responseLengths = {};
    this.roundStart = null;
    this.round = 0;
  }

  startRound() {
    this.roundStart = Date.now();
    this.round++;
  }

  endRound() {
    if (this.roundStart) {
      const duration = Date.now() - this.roundStart;
      this.roundTimes.push({ round: this.round, duration });
      this.roundStart = null;
    }
  }

  addResponse(persona, response, tokensUsed) {
    this.apiCalls++;
    // Track token usage per persona and per round
    if (!this.tokenUsage[persona]) this.tokenUsage[persona] = [];
    this.tokenUsage[persona].push({ round: this.round, tokens: tokensUsed });
    // Track response length
    if (!this.responseLengths[persona]) this.responseLengths[persona] = [];
    this.responseLengths[persona].push(response.length);
  }

  addConsensusPoint() {
    this.consensusPoints++;
  }

  addDivergencePoint() {
    this.divergencePoints++;
  }

  generateReport() {
    // Calculate average response length per persona
    const avgResponseLength = {};
    for (const persona in this.responseLengths) {
      const arr = this.responseLengths[persona];
      avgResponseLength[persona] = arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    }
    return {
      apiCalls: this.apiCalls,
      tokenUsage: this.tokenUsage,
      roundTimes: this.roundTimes,
      consensusPoints: this.consensusPoints,
      divergencePoints: this.divergencePoints,
      avgResponseLength
    };
  }

  exportToJSON(filePath) {
    const report = this.generateReport();
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  }
}

module.exports = MetricsCollector;
