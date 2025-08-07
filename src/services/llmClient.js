const MockLLMClient = require('./mockLLMClient');
const MetricsCollector = require('../utils/metrics');
const useMock = process.env.USE_MOCK_LLM === 'true';
const metrics = new MetricsCollector();
let client;

if (useMock) {
  client = new MockLLMClient();
} else {
  // Minimal Gemini API client using fetch
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  client = {
    async sendPrompt(systemPrompt, userPrompt, temperature, maxTokens) {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;
      const body = {
        contents: [
          { role: 'system', parts: [{ text: systemPrompt }] },
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: { temperature, maxOutputTokens: maxTokens }
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Gemini API error: ' + res.status);
      const data = await res.json();
      return data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text || '';
    }
  };
}

async function callLLM(systemPrompt, userPrompt, temperature, maxTokens, personaType) {
  let response, tokensUsed = 0;
  let attempt = 0;
  let delay = 500;
  const maxAttempts = 5;
  while (attempt < maxAttempts) {
    try {
      if (useMock) {
        response = await client.sendPrompt(userPrompt, personaType);
        tokensUsed = response.split(' ').length;
      } else {
        response = await client.sendPrompt(systemPrompt, userPrompt, temperature, maxTokens);
        tokensUsed = response.split(' ').length;
      }
      metrics.addResponse(personaType, response, tokensUsed);
      return response;
    } catch (err) {
      attempt++;
      if (attempt >= maxAttempts) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

module.exports = {
  callLLM,
  metrics
};
