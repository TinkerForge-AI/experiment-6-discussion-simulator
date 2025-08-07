// Persona relevance selector for multi-agent discussions
class PersonaSelector {
  detectDomain(problem) {
    // Simple keyword-based domain detection
    const technical = /tech|implement|system|architecture|algorithm|code/.test(problem.toLowerCase());
    const creative = /innovate|creative|idea|intuitive|unconventional/.test(problem.toLowerCase());
    const strategic = /strategy|plan|decision|priority|risk/.test(problem.toLowerCase());
    const operational = /process|step|operation|execute|minimal/.test(problem.toLowerCase());
    if (technical) return 'technical';
    if (creative) return 'creative';
    if (strategic) return 'strategic';
    if (operational) return 'operational';
    return 'general';
  }

  getCompatibilityMatrix() {
    // Example compatibility matrix (personaId pairs that work well together)
    return {
      'PRAG': ['TECH', 'SAFE', 'OPT'],
      'TECH': ['PRAG', 'INNOV', 'RAT'],
      'OPT': ['INNOV', 'IRRAT', 'PRAG'],
      'PESS': ['SAFE', 'CRIT', 'OVER'],
      'SAFE': ['PESS', 'TECH', 'CRIT'],
      'CRIT': ['PESS', 'SAFE', 'RAT'],
      'LAZY': ['PRAG', 'OPT'],
      'OVER': ['CRIT', 'PESS'],
      'RAT': ['TECH', 'CRIT'],
      'IRRAT': ['INNOV', 'OPT'],
      'INNOV': ['TECH', 'OPT', 'IRRAT']
    };
  }

  composeTeam(problem, availablePersonas, minDiversity = true) {
    // Dynamic team composition based on problem domain and compatibility
    const domain = this.detectDomain(problem);
    let team = [];
    // Select by domain
    if (domain === 'technical') {
      team = availablePersonas.filter(p => ['TECH', 'PRAG', 'SAFE', 'INNOV', 'RAT'].includes(p.id));
    } else if (domain === 'creative') {
      team = availablePersonas.filter(p => ['INNOV', 'IRRAT', 'OPT', 'LAZY'].includes(p.id));
    } else if (domain === 'strategic') {
      team = availablePersonas.filter(p => ['PRAG', 'PESS', 'CRIT', 'SAFE', 'OVER'].includes(p.id));
    } else if (domain === 'operational') {
      team = availablePersonas.filter(p => ['PRAG', 'LAZY', 'TECH', 'SAFE'].includes(p.id));
    } else {
      team = availablePersonas.slice(0, 4);
    }
    // Ensure minimum diversity (always include a contrarian)
    if (minDiversity && !team.some(p => p.id === 'PESS' || p.id === 'CRIT' || p.id === 'OVER')) {
      const contrarian = availablePersonas.find(p => ['PESS', 'CRIT', 'OVER'].includes(p.id));
      if (contrarian) team.push(contrarian);
    }
    // Use compatibility matrix to add compatible personas
    const matrix = this.getCompatibilityMatrix();
    team.forEach(p => {
      const compatible = matrix[p.id] || [];
      compatible.forEach(cid => {
        if (!team.some(tp => tp.id === cid)) {
          const persona = availablePersonas.find(ap => ap.id === cid);
          if (persona) team.push(persona);
        }
      });
    });
    // Remove duplicates
    team = team.filter((p, i, arr) => arr.findIndex(pp => pp.id === p.id) === i);
    return team;
  }

  learnSuccessfulCombinations(history) {
    // Learn from successful combinations (simple: count frequency)
    const comboCounts = {};
    history.forEach(session => {
      const ids = session.personas.map(p => p.id).sort().join(',');
      comboCounts[ids] = (comboCounts[ids] || 0) + 1;
    });
    // Return most frequent combinations
    return Object.entries(comboCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([combo]) => combo.split(','));
  }
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
