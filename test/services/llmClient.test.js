const { callLLM, metrics } = require('../../src/services/llmClient');

describe('llmClient service', () => {
  beforeAll(() => {
    process.env.USE_MOCK_LLM = 'true';
  });

  it('returns persona-specific mock responses', async () => {
    const systemPrompt = 'System prompt';
    const userPrompt = 'How do we solve climate change?';
    const temperature = 0.5;
    const maxTokens = 128;

    const prag = await callLLM(systemPrompt, userPrompt, temperature, maxTokens, 'PRAG');
    expect(prag).toMatch(/practical, step-by-step solution/i);

    const pess = await callLLM(systemPrompt, userPrompt, temperature, maxTokens, 'PESS');
    expect(pess).toMatch(/risks.*worst-case/i);

    const opt = await callLLM(systemPrompt, userPrompt, temperature, maxTokens, 'OPT');
    expect(opt).toMatch(/opportunity.*best possible outcome/i);
  });

  it('tracks metrics for each call', async () => {
    const initialCalls = metrics.apiCalls;
    await callLLM('System', 'Prompt', 0.3, 64, 'PRAG');
    expect(metrics.apiCalls).toBe(initialCalls + 1);
    expect(metrics.tokenUsage['PRAG'].length).toBeGreaterThan(0);
  });

  it('retries on error (mock)', async () => {
    // Simulate error by temporarily replacing sendPrompt
    const originalSendPrompt = require('../../src/services/mockLLMClient').prototype.sendPrompt;
    require('../../src/services/mockLLMClient').prototype.sendPrompt = async () => { throw new Error('fail'); };
    try {
      await expect(callLLM('System', 'Prompt', 0.3, 64, 'PRAG')).rejects.toThrow('fail');
    } finally {
      require('../../src/services/mockLLMClient').prototype.sendPrompt = originalSendPrompt;
    }
  });
});
