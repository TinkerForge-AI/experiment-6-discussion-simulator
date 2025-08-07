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
};
