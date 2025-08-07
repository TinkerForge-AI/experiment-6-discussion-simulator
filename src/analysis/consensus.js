function identifyConflicts(responses) {
  // Find pairs of responses with very low agreement (potential contradiction)
  const conflicts = [];
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const score = agreementScore(responses[i], responses[j]);
      if (score < 0.2) {
        conflicts.push({ response1: responses[i], response2: responses[j], score });
      }
    }
  }
  return conflicts;
}

function classifyDisagreement(response1, response2) {
  // Heuristic: factual (contradictory facts), approach (different methods), priority (different focus)
  if (/not|never|no|impossible/.test(response1) && /yes|possible|can/.test(response2)) {
    return 'factual';
  }
  if (/should|must|need/.test(response1) && /could|might|optional/.test(response2)) {
    return 'priority';
  }
  // If both mention different methods/steps
  if (/step|method|process/.test(response1) && /step|method|process/.test(response2) && agreementScore(response1, response2) < 0.4) {
    return 'approach';
  }
  return 'unknown';
}

function promptResolution(conflict, personas) {
  // Generate prompts for personas to resolve a conflict
  return personas.map(p => `Persona ${p.name}, please address the disagreement between: "${conflict.response1}" and "${conflict.response2}"`);
}

class ConflictTracker {
  constructor() {
    this.conflictsByRound = {};
  }
  track(round, conflicts) {
    this.conflictsByRound[round] = conflicts;
  }
  getConflicts(round) {
    return this.conflictsByRound[round] || [];
  }
  getAllConflicts() {
    return this.conflictsByRound;
  }
}
// Consensus analysis utilities
function agreementScore(response1, response2) {
  // Simple semantic similarity: keyword overlap and phrase matching
  const words1 = new Set(response1.toLowerCase().split(/\W+/));
  const words2 = new Set(response2.toLowerCase().split(/\W+/));
  const overlap = [...words1].filter(w => words2.has(w));
  const score = overlap.length / Math.max(words1.size, words2.size);
  // Phrase matching bonus
  const phraseBonus = response1.includes(response2) || response2.includes(response1) ? 0.2 : 0;
  return Math.min(score + phraseBonus, 1);
}

function findConsensusGroups(responses, threshold = 0.6) {
  // Group responses with agreementScore >= threshold
  const groups = [];
  const used = new Set();
  for (let i = 0; i < responses.length; i++) {
    if (used.has(i)) continue;
    const group = [responses[i]];
    used.add(i);
    for (let j = i + 1; j < responses.length; j++) {
      if (agreementScore(responses[i], responses[j]) >= threshold) {
        group.push(responses[j]);
        used.add(j);
      }
    }
    groups.push(group);
  }
  return groups;
}

function identifyOutliers(responses, threshold = 0.3) {
  // Find responses with low agreement to all others
  return responses.filter((r, i) => {
    const scores = responses.map((other, j) => i !== j ? agreementScore(r, other) : 1);
    return Math.max(...scores) < threshold;
  });
}

function trackConsensusEvolution(metricsCollector, consensusGroups) {
  // Example: add consensus points to metrics
  metricsCollector.consensusPoints += consensusGroups.length;
}

module.exports = {
  agreementScore,
  findConsensusGroups,
  identifyOutliers,
  trackConsensusEvolution
  ,identifyConflicts
  ,classifyDisagreement
  ,promptResolution
  ,ConflictTracker
};
