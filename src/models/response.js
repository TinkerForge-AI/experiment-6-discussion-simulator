// Response models for multi-agent discussion
class AgentResponse {
  constructor({ personaId, content, responseType, timestamp = Date.now(), tokenCount = 0 }) {
    this.personaId = personaId;
    this.content = content;
    this.responseType = responseType; // 'solution' | 'question' | 'critique'
    this.timestamp = timestamp;
    this.tokenCount = tokenCount;
  }
}

class CrossTalkResponse extends AgentResponse {
  constructor({ personaId, content, responseType, timestamp, tokenCount, targetPersonaId, agreementLevel }) {
    super({ personaId, content, responseType, timestamp, tokenCount });
    this.targetPersonaId = targetPersonaId;
    this.agreementLevel = agreementLevel; // 0-1 scale
  }
}

class DiscussionRound {
  constructor(roundNumber) {
    this.roundNumber = roundNumber;
    this.responses = [];
    this.crossTalkResponses = [];
    this.metrics = {};
  }

  addResponse(response) {
    this.responses.push(response);
  }

  addCrossTalkResponse(crossResponse) {
    this.crossTalkResponses.push(crossResponse);
  }

  calculateConsensusScore() {
    // Simple: count agreementLevel > 0.6
    if (!this.crossTalkResponses.length) return 0;
    const consensus = this.crossTalkResponses.filter(r => r.agreementLevel > 0.6).length;
    return consensus / this.crossTalkResponses.length;
  }

  calculateDivergenceScore() {
    // Simple: count agreementLevel < 0.4
    if (!this.crossTalkResponses.length) return 0;
    const divergence = this.crossTalkResponses.filter(r => r.agreementLevel < 0.4).length;
    return divergence / this.crossTalkResponses.length;
  }
}

module.exports = {
  AgentResponse,
  CrossTalkResponse,
  DiscussionRound
};
