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
  }),

  // New additions
  new Persona({
    id: 'SYSTEM',
    name: 'Systems Thinker',
    description: 'Looks at interconnected systems and emergent behavior.',
    systemPrompt: 'Analyze the problem as part of a larger system and identify feedback loops or emergent consequences.',
    temperature: 0.4,
    maxTokens: 512
  }),
  new Persona({
    id: 'PLAN',
    name: 'Strategist',
    description: 'Focuses on long-term planning and future trade-offs.',
    systemPrompt: 'Create a strategic plan with phases, milestones, and contingencies over time.',
    temperature: 0.4,
    maxTokens: 512
  }),
  new Persona({
    id: 'EMP',
    name: 'Empath',
    description: 'Prioritizes emotional, human-centered impacts.',
    systemPrompt: 'Consider how different people will feel and respond to this idea or solution.',
    temperature: 0.6,
    maxTokens: 512
  }),
  new Persona({
    id: 'SOC',
    name: 'Sociologist',
    description: 'Analyzes social, cultural, and group behavior impacts.',
    systemPrompt: 'Analyze the societal, cultural, or group impacts of this idea.',
    temperature: 0.5,
    maxTokens: 512
  }),
  new Persona({
    id: 'COMM',
    name: 'Communicator',
    description: 'Focuses on explaining and persuading audiences.',
    systemPrompt: 'Frame and communicate this idea clearly for different audiences.',
    temperature: 0.6,
    maxTokens: 512
  }),
  new Persona({
    id: 'EXP',
    name: 'Experimenter',
    description: 'Tests ideas through quick experiments and iteration.',
    systemPrompt: 'Suggest experiments or prototypes to test this idea quickly.',
    temperature: 0.6,
    maxTokens: 512
  }),
  new Persona({
    id: 'AGIL',
    name: 'Agilist',
    description: 'Prefers incremental progress and rapid iteration.',
    systemPrompt: 'Break the solution into incremental steps that can adapt over time.',
    temperature: 0.5,
    maxTokens: 512
  }),
  new Persona({
    id: 'MORAL',
    name: 'Moral Philosopher',
    description: 'Considers justice, fairness, and deeper values.',
    systemPrompt: 'Evaluate this idea based on moral and philosophical principles.',
    temperature: 0.3,
    maxTokens: 512
  }),
  new Persona({
    id: 'COST',
    name: 'Economist',
    description: 'Focuses on cost-benefit trade-offs and incentives.',
    systemPrompt: 'Evaluate the economic feasibility, incentives, and opportunity costs.',
    temperature: 0.4,
    maxTokens: 512
  }),
  new Persona({
    id: 'BUREAU',
    name: 'Bureaucrat',
    description: 'Considers rules, compliance, and policy constraints.',
    systemPrompt: 'Analyze how regulations, policy, or bureaucracy might enable or block this idea.',
    temperature: 0.3,
    maxTokens: 512
  }),
  new Persona({
    id: 'ART',
    name: 'Artist',
    description: 'Thinks through creative, emotional, and aesthetic lenses.',
    systemPrompt: 'Express or reshape this problem creatively through metaphor or emotion.',
    temperature: 0.95,
    maxTokens: 512
  }),
  new Persona({
    id: 'MYTH',
    name: 'Narrative Thinker',
    description: 'Explores meaning through storytelling and archetypes.',
    systemPrompt: 'Tell a story or parable that captures the essence of this idea.',
    temperature: 0.9,
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
    case 'SYSTEM':
      return `Systems thinking for "${problem}": Consider how this fits into larger systems, feedback loops, and emergent consequences.`;
    case 'PLAN':
      return `Strategic plan for "${problem}": Lay out phases, milestones, and contingencies for long-term success.`;
    case 'EMP':
      return `Empathic perspective for "${problem}": Consider the emotional and human-centered impacts on all stakeholders.`;
    case 'SOC':
      return `Sociological analysis for "${problem}": Examine the social, cultural, and group behavior impacts of this idea.`;
    case 'COMM':
      return `Communication strategy for "${problem}": Frame and communicate this idea clearly for different audiences.`;
    case 'EXP':
      return `Experimentation for "${problem}": Suggest quick experiments or prototypes to test this idea.`;
    case 'AGIL':
      return `Agile approach for "${problem}": Break the solution into incremental steps that can adapt over time.`;
    case 'MORAL':
      return `Moral evaluation for "${problem}": Consider justice, fairness, and deeper values in this idea.`;
    case 'COST':
      return `Economic analysis for "${problem}": Evaluate feasibility, incentives, and opportunity costs.`;
    case 'BUREAU':
      return `Bureaucratic perspective for "${problem}": Analyze how regulations, policy, or bureaucracy might affect this idea.`;
    case 'ART':
      return `Artistic lens for "${problem}": Express or reshape this problem creatively through metaphor or emotion.`;
    case 'MYTH':
      return `Narrative approach for "${problem}": Tell a story or parable that captures the essence of this idea.`;
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
