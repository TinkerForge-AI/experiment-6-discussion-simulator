// Persona class
class Persona {
  constructor({ id, name, description, systemPrompt, temperature, maxTokens }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.systemPrompt = systemPrompt;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
  }
}

// Initial personas
const personas = [
  new Persona({
    id: 'PRAG',
    name: 'Pragmatist',
    description: 'Focuses on practical, implementable solutions.',
    systemPrompt: 'Provide practical, step-by-step solutions.',
    temperature: 0.3,
    maxTokens: 512
  }),
  new Persona({
    id: 'PESS',
    name: 'Pessimist',
    description: 'Highlights risks and worst-case scenarios.',
    systemPrompt: 'Focus on risks and worst-case outcomes.',
    temperature: 0.5,
    maxTokens: 512
  }),
  new Persona({
    id: 'OPT',
    name: 'Optimist',
    description: 'Identifies opportunities and best-case outcomes.',
    systemPrompt: 'Emphasize opportunities and best-case outcomes.',
    temperature: 0.7,
    maxTokens: 512
  }),
  new Persona({
    id: 'TECH',
    name: 'Technical Analyst',
    description: 'Provides detailed implementation steps and technical analysis.',
    systemPrompt: 'Break down the problem into technical components and provide implementation details.',
    temperature: 0.4,
    maxTokens: 512
  }),
  new Persona({
    id: 'CRIT',
    name: 'Critical Thinker',
    description: 'Asks probing questions and challenges assumptions.',
    systemPrompt: 'Ask probing questions and challenge assumptions to deepen understanding.',
    temperature: 0.5,
    maxTokens: 512
  }),
  new Persona({
    id: 'SAFE',
    name: 'Safety Advocate',
    description: 'Focuses on risks, ethics, and safety concerns.',
    systemPrompt: 'Highlight safety, ethical, and risk considerations in all solutions.',
    temperature: 0.3,
    maxTokens: 512
  }),
  new Persona({
    id: 'LAZY',
    name: 'Minimalist',
    description: 'Suggests the simplest, least effort solutions.',
    systemPrompt: 'Propose the simplest and most minimal solution possible.',
    temperature: 0.6,
    maxTokens: 512
  }),
  new Persona({
    id: 'OVER',
    name: 'Overthinker',
    description: 'Considers edge cases and complex scenarios.',
    systemPrompt: 'Identify edge cases and complex scenarios that could arise.',
    temperature: 0.8,
    maxTokens: 512
  }),
  new Persona({
    id: 'RAT',
    name: 'Rationalist',
    description: 'Focuses on logic, evidence, and rational analysis.',
    systemPrompt: 'Analyze the problem using logic and evidence-based reasoning.',
    temperature: 0.2,
    maxTokens: 512
  }),
  new Persona({
    id: 'IRRAT',
    name: 'Intuitive',
    description: 'Suggests unconventional, intuitive ideas.',
    systemPrompt: 'Offer unconventional, intuitive, or creative ideas.',
    temperature: 0.9,
    maxTokens: 512
  }),
  new Persona({
    id: 'INNOV',
    name: 'Innovator',
    description: 'Proposes unproven, innovative approaches.',
    systemPrompt: 'Propose innovative and unproven approaches to the problem.',
    temperature: 0.7,
    maxTokens: 512
  })
];

// getMockResponse function
function getMockResponse(personaId, problem) {
  switch (personaId) {
    case 'PRAG':
      return `To address "${problem}", here is a practical, step-by-step solution: 1) Identify the core issue, 2) Gather necessary resources, 3) Implement the solution incrementally, 4) Monitor progress and adjust as needed.`;
    case 'PESS':
      return `Considering "${problem}", the main risks include potential failure points, resource limitations, and worst-case scenarios. It's important to prepare for setbacks and have contingency plans in place.`;
    case 'OPT':
      return `For "${problem}", this is a great opportunity to innovate and achieve the best possible outcome. By leveraging strengths and exploring new ideas, we can maximize success and create positive impact.`;
    case 'TECH':
      return `Technical breakdown for "${problem}": 1) Analyze requirements, 2) Design system architecture, 3) Specify implementation steps, 4) Identify technical risks.`;
    case 'CRIT':
      return `Critical questions for "${problem}": What assumptions are we making? What could go wrong? What evidence supports our approach?`;
    case 'SAFE':
      return `Safety and ethics for "${problem}": Consider risks to users, ethical implications, and mitigation strategies for worst-case scenarios.`;
    case 'LAZY':
      return `Minimalist solution for "${problem}": What is the least effort way to address this? Remove unnecessary steps and focus on essentials.`;
    case 'OVER':
      return `Overthinking "${problem}": What are the edge cases, rare scenarios, and complex interactions that could arise?`;
    case 'RAT':
      return `Rational analysis for "${problem}": Use logic, evidence, and data to support the best solution.`;
    case 'IRRAT':
      return `Intuitive ideas for "${problem}": Consider creative, unconventional, or gut-feeling approaches.`;
    case 'INNOV':
      return `Innovative approach for "${problem}": Propose unproven, experimental, or breakthrough solutions.`;
    default:
      return `Default response for: ${problem}`;
  }
}

// PersonaRegistry class
class PersonaRegistry {
  constructor(personaList) {
    this.personas = {};
    personaList.forEach(p => {
      this.personas[p.id] = p;
    });
  }
  getPersona(id) {
    return this.personas[id];
  }
  getAllPersonas() {
    return Object.values(this.personas);
  }
}

module.exports = {
  Persona,
  personas,
  getMockResponse,
  PersonaRegistry
};
