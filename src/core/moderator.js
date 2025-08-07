// Orchestration logic for discussion
const ContextWindow = require('../utils/contextManager');

class Moderator {
  constructor(personas, enableCrossTalk = true, metricsCollector) {
    this.personas = personas;
    this.enableCrossTalk = enableCrossTalk;
    this.metrics = metricsCollector;
    this.context = new ContextWindow();
    this.discussionTree = [];
  }

  async runInitialRound(problem, callLLM) {
    // Each persona responds to the problem
    const responses = [];
    for (const persona of this.personas) {
      const response = await callLLM(
        persona.systemPrompt,
        problem,
        persona.temperature,
        persona.maxTokens,
        persona.id
      );
      responses.push({ persona, response });
      this.context.addMessage(response);
      this._addToTree(persona, response);
    }
    return responses;
  }

  async runCrossTalk(responses, callLLM) {
    // Identify 2-3 divergent responses and prompt other agents to respond
    const divergent = responses.slice(0, 3); // Simple: first 3 as divergent
    const crossTalks = [];
    for (const { persona: targetPersona, response: targetResponse } of divergent) {
      for (const respondingPersona of this.personas) {
        if (respondingPersona.id !== targetPersona.id) {
          const prompt = this.formatCrossTalkPrompt(targetPersona, respondingPersona, targetResponse);
          const crossResponse = await callLLM(
            respondingPersona.systemPrompt,
            prompt,
            respondingPersona.temperature,
            respondingPersona.maxTokens,
            respondingPersona.id
          );
          crossTalks.push({ targetPersona, respondingPersona, crossResponse });
          this.context.addMessage(crossResponse);
          this._addToTree(respondingPersona, crossResponse, targetPersona);
        }
      }
    }
    return crossTalks;
  }

  formatCrossTalkPrompt(targetPersona, respondingPersona, targetResponse) {
    return `Persona ${respondingPersona.name}, please respond to ${targetPersona.name}'s statement: "${targetResponse}"`;
  }

  getDiscussionTreeMarkdown() {
    // Build a Markdown representation of the discussion tree
    let md = '# Discussion Flow\n';
    for (const node of this.discussionTree) {
      const parent = node.parentPersonaId ? ` (in response to ${node.parentPersonaId})` : '';
      md += `\n- **${node.personaId}**${parent}:\n    > ${node.response.replace(/\n/g, '\n    > ')}`;
    }
    return md;
  }

  _addToTree(persona, response, parentPersona = null) {
    // Track discussion flow in a tree structure
    this.discussionTree.push({
      personaId: persona.id,
      response,
      parentPersonaId: parentPersona ? parentPersona.id : null
    });
  }
}

module.exports = Moderator;
