// Mock LLM client for testing
// Mock LLM client for testing
class MockLLMClient {
  constructor() {
    this.mockApiCallCount = 0;
  }

  async sendPrompt(prompt, personaType) {
    this.mockApiCallCount++;
    await this._simulateDelay();
    switch (personaType) {
      case 'PRAG':
        return 'Here is a practical, step-by-step solution to your problem.';
      case 'PESS':
        return 'There are several risks and concerns to consider in this scenario.';
      case 'OPT':
        return 'This presents a great opportunity for new ideas and growth!';
      default:
        return 'Default mock response.';
    }
  }

  getApiCallCount() {
    return this.mockApiCallCount;
  }

  async _simulateDelay() {
    const delay = Math.floor(Math.random() * 400) + 100; // 100-500ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

module.exports = MockLLMClient;
