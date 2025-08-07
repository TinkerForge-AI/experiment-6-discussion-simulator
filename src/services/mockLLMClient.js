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
        return `To address "${prompt}", here is a practical, step-by-step solution: 1) Identify the core issue, 2) Gather necessary resources, 3) Implement the solution incrementally, 4) Monitor progress and adjust as needed.`;
      case 'PESS':
        return `Considering "${prompt}", the main risks include potential failure points, resource limitations, and worst-case scenarios. It's important to prepare for setbacks and have contingency plans in place.`;
      case 'OPT':
        return `For "${prompt}", this is a great opportunity to innovate and achieve the best possible outcome. By leveraging strengths and exploring new ideas, we can maximize success and create positive impact.`;
      default:
        return `Default response for: ${prompt}`;
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
