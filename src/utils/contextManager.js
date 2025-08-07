// Context manager for rolling conversation history
const tokenCounter = require('./tokenCounter');

class ContextWindow {
  constructor(maxTokens = 2000) {
    this.maxTokens = maxTokens;
    this.history = [];
    this.round = 0;
    this.keyDecisions = [];
  }

  addMessage(message, isDecision = false) {
    this.history.push(message);
    if (isDecision) this.keyDecisions.push(message);
    this.round++;
    if (this.round % 3 === 0) {
      this.compress();
    }
    this._enforceTokenLimit();
  }

  getContext() {
    return this.history.join('\n');
  }

  compress() {
    // Compress history to bullet points, preserve key decisions
    const compressed = this.history.map(msg => `• ${msg}`).join('\n');
    this.history = [...this.keyDecisions, compressed];
  }

  extractKeyDecisions() {
    return [...this.keyDecisions];
  }

  _enforceTokenLimit() {
    let context = this.getContext();
    let tokens = tokenCounter.countTokens(context);
    while (tokens > this.maxTokens && this.history.length > 1) {
      this.history.shift();
      context = this.getContext();
      tokens = tokenCounter.countTokens(context);
    }
  }
}

module.exports = ContextWindow;
