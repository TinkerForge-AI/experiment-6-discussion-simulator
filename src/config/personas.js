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
