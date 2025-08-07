// Persistent context manager for discussion simulator
class PersistentContext {
  constructor() {
    this.activeContext = [];
    this.historyArchive = [];
    this.round = 0;
    this.summary = { decisions: [], openQuestions: [], keyPoints: [] };
  }

  addMessage(message, type = 'keyPoint') {
    this.activeContext.push(message);
    if (type === 'decision') this.summary.decisions.push(message);
    if (type === 'openQuestion') this.summary.openQuestions.push(message);
    if (type === 'keyPoint') this.summary.keyPoints.push(message);
    this.round++;
    if (this.round % 3 === 0) {
      this.generateSummary();
      this.archiveCurrent();
      this.resetActiveContext();
    }
  }

  generateSummary() {
    // Structured summary after every 2-3 rounds
    return { ...this.summary };
  }

  resetActiveContext(problem = '') {
    // Reset active context to summary + current problem
    this.activeContext = [problem, ...this.summary.decisions, ...this.summary.openQuestions, ...this.summary.keyPoints];
  }

  archiveCurrent() {
    // Archive full history for reference
    this.historyArchive.push({
      round: this.round,
      context: [...this.activeContext],
      summary: this.generateSummary()
    });
  }

  queryHistory(roundNumber) {
    // Query historical context by round
    return this.historyArchive.find(h => h.round === roundNumber) || null;
  }

  getFullArchive() {
    return [...this.historyArchive];
  }
}

module.exports = PersistentContext;
