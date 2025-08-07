// Mock LLM client for testing
module.exports = class MockLLMClient {
  async sendPrompt(prompt) {
    return `Mock response for: ${prompt}`;
  }
};
