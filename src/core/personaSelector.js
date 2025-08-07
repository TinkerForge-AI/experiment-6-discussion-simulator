// Persona relevance selector for multi-agent discussions
class PersonaSelector {
  detectDomain(problem) {
    // Enhanced keyword-based domain detection for new personas
    const text = problem.toLowerCase();
    if (/tech|implement|system|architecture|algorithm|code|technical|detail|breakdown/.test(text)) return 'technical';
    if (/innovate|creative|idea|intuitive|unconventional|artist|art|story|narrative|myth/.test(text)) return 'creative';
    if (/strategy|plan|decision|priority|risk|moral|philosophy|cost|economics|bureaucracy|policy/.test(text)) return 'strategic';
    if (/process|step|operation|execute|minimal|agile|experiment|prototype|incremental/.test(text)) return 'operational';
    if (/empathy|emotion|society|social|group|communicate|audience/.test(text)) return 'human';
    return 'general';
  }

  getCompatibilityMatrix() {
    // Expanded compatibility matrix for new personas
    return {
      'PRAG': ['TECH', 'SAFE', 'OPT', 'PLAN', 'LAZY'],
      'TECH': ['PRAG', 'INNOV', 'RAT', 'SYSTEM', 'SAFE'],
      'OPT': ['INNOV', 'IRRAT', 'PRAG', 'ART', 'EMP'],
      'PESS': ['SAFE', 'CRIT', 'OVER', 'MORAL', 'BUREAU'],
      'SAFE': ['PESS', 'TECH', 'CRIT', 'SYSTEM', 'MORAL'],
      'CRIT': ['PESS', 'SAFE', 'RAT', 'OVER', 'PLAN'],
      'LAZY': ['PRAG', 'OPT', 'AGIL'],
      'OVER': ['CRIT', 'PESS', 'TECH'],
      'RAT': ['TECH', 'CRIT', 'PLAN'],
      'IRRAT': ['INNOV', 'OPT', 'ART', 'MYTH'],
      'INNOV': ['TECH', 'OPT', 'IRRAT', 'EXP'],
      'SYSTEM': ['TECH', 'SAFE', 'PLAN'],
      'PLAN': ['PRAG', 'CRIT', 'RAT', 'SYSTEM'],
      'EMP': ['OPT', 'SOC', 'COMM'],
      'SOC': ['EMP', 'COMM', 'ART'],
      'COMM': ['EMP', 'SOC', 'ART'],
      'EXP': ['INNOV', 'AGIL', 'LAZY'],
      'AGIL': ['EXP', 'LAZY', 'PRAG'],
      'MORAL': ['SAFE', 'PESS', 'PLAN'],
      'COST': ['PLAN', 'BUREAU', 'PRAG'],
      'BUREAU': ['COST', 'PESS', 'SAFE'],
      'ART': ['OPT', 'IRRAT', 'SOC', 'COMM', 'MYTH'],
      'MYTH': ['ART', 'IRRAT', 'OPT']
    };
  }

  composeTeam(problem, availablePersonas, minDiversity = true) {
    // Dynamic team composition based on problem domain and compatibility
    const domain = this.detectDomain(problem);
    let team = [];
    // Select by domain
    if (domain === 'technical') {
      team = availablePersonas.filter(p => ['TECH', 'PRAG', 'SAFE', 'INNOV', 'RAT', 'SYSTEM'].includes(p.id));
    } else if (domain === 'creative') {
      team = availablePersonas.filter(p => ['INNOV', 'IRRAT', 'OPT', 'LAZY', 'ART', 'MYTH'].includes(p.id));
    } else if (domain === 'strategic') {
      team = availablePersonas.filter(p => ['PRAG', 'PESS', 'CRIT', 'SAFE', 'OVER', 'PLAN', 'MORAL', 'COST', 'BUREAU'].includes(p.id));
    } else if (domain === 'operational') {
      team = availablePersonas.filter(p => ['PRAG', 'LAZY', 'TECH', 'SAFE', 'AGIL', 'EXP'].includes(p.id));
    } else if (domain === 'human') {
      team = availablePersonas.filter(p => ['EMP', 'SOC', 'COMM', 'OPT', 'ART'].includes(p.id));
    } else {
      team = availablePersonas.slice(0, 4);
    }
    // Ensure minimum diversity (always include a contrarian)
    if (minDiversity && !team.some(p => ['PESS', 'CRIT', 'OVER', 'LAZY', 'IRRAT', 'BUREAU'].includes(p.id))) {
      const contrarian = availablePersonas.find(p => ['PESS', 'CRIT', 'OVER', 'LAZY', 'IRRAT', 'BUREAU'].includes(p.id));
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
