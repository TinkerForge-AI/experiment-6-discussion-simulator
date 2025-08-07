// Context manager for rolling conversation history
const tokenCounter = require('./tokenCounter');

class ContextWindow {
  summarize(level = 'medium', consensusItems = [], actionItems = []) {
    // Intelligent summarization with compression levels
    // level: 'light' (80%), 'medium' (50%), 'heavy' (20%)
    let retainRatio = 0.5;
    if (level === 'light') retainRatio = 0.8;
    if (level === 'heavy') retainRatio = 0.2;
    const total = this.history.length;
    // Priority: key decisions, consensus, action items
    let priorityItems = [...this.keyDecisions, ...consensusItems, ...actionItems];
    // Remove duplicates
    priorityItems = [...new Set(priorityItems)];
    // Retain priority items and a sample of the rest
    const retained = [
      ...priorityItems,
      ...this.history.filter(msg => !priorityItems.includes(msg)).slice(0, Math.ceil((total - priorityItems.length) * retainRatio))
    ];
    this.history = retained;
    this._enforceTokenLimit();
  }

  compress(level = 'medium', consensusItems = [], actionItems = []) {
    // Use summarize for compression
    this.summarize(level, consensusItems, actionItems);
    // Format as bullet points
    this.history = this.history.map(msg => `• ${msg}`);
  }

  zoomInOnCompressed(index) {
    // Ability to zoom in on a compressed item
    if (index < 0 || index >= this.history.length) return null;
    const item = this.history[index];
    // If item is a bullet, return the original message
    return item.startsWith('• ') ? item.slice(2) : item;
  }
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
