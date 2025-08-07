// Interest analysis utilities for threads
function calculateInterest(thread) {
  // Use response length, participants, follow-ups
  const responseLength = thread.messages.reduce((a, m) => a + (m.content ? m.content.length : 0), 0);
  const participantCount = thread.participants.length;
  const followUps = thread.messages.filter(m => m.isFollowUp).length;
  // Simple interest score
  return responseLength / 100 + participantCount + followUps * 2;
}

function trackInterest(threads) {
  // Real-time interest tracking
  return threads.map(t => ({ id: t.id, interest: calculateInterest(t) }));
}

function thresholdPromotion(thread, threshold = 10) {
  // Promote/demote threads based on interest
  if (calculateInterest(thread) >= threshold) {
    thread.status = 'active';
  } else if (calculateInterest(thread) < threshold / 2) {
    thread.status = 'dormant';
  }
  return thread.status;
}

function findSurprisingConsensus(threads, consensusFn, threshold = 0.8) {
  // Surface unexpected agreement in threads
  return threads.filter(t => {
    const consensusGroups = consensusFn(t.messages.map(m => m.content), threshold);
    return consensusGroups.length > 1 && consensusGroups.some(g => g.length > 1);
  });
}

function integrateInterestWithMetrics(metricsCollector, threads) {
  // Add interest patterns to metrics
  metricsCollector.interestPatterns = threads.map(t => ({ id: t.id, interest: calculateInterest(t) }));
}

module.exports = {
  calculateInterest,
  trackInterest,
  thresholdPromotion,
  findSurprisingConsensus,
  integrateInterestWithMetrics
};
