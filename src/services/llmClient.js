// LLM interface
module.exports = class LLMClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async sendPrompt(prompt) {
    // ...existing code...
  }
};
