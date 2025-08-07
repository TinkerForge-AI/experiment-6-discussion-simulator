// Persona relevance selector for multi-agent discussions
class PersonaSelector {
  constructor(personas) {
    this.personas = personas;
  }

  // Analyze relevance using simple keyword matching and scoring
  analyzeRelevance(problem, availablePersonas, topN = 4, overrideIds = []) {
    // If manual override, return those personas
    if (overrideIds && overrideIds.length > 0) {
      return availablePersonas.filter(p => overrideIds.includes(p.id));
    }
    // Simple keyword matching for scoring
    const keywords = problem.toLowerCase().split(/\W+/);
    const scores = availablePersonas.map(persona => {
      let score = 0;
      if (persona.description) {
        keywords.forEach(kw => {
          if (persona.description.toLowerCase().includes(kw)) score += 2;
          if (persona.systemPrompt && persona.systemPrompt.toLowerCase().includes(kw)) score += 1;
        });
      }
      // Canned scores for mock mode
      if (process.env.USE_MOCK_LLM === 'true' && persona.mockRelevance !== undefined) {
        score = persona.mockRelevance;
      }
      return { persona, score: Math.min(score, 10) };
    });
    // Sort by score and select top N
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topN).map(s => s.persona);
  }
}

module.exports = PersonaSelector;
