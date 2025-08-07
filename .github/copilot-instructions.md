
# Experiment 6: Discussion Simulator — Copilot Instructions

## Project Overview
This is a modular Node.js simulator for multi-agent discussions, supporting both real LLM and mock LLM modes. The system is designed for extensibility, analytics, and persona-driven reasoning.

## Architecture & Key Components
- **src/index.js**: Entry point, loads environment variables, starts CLI.
- **src/config/personas.js**: Defines personas, registry, and mock response logic. Extend here for new agent types.
- **src/core/moderator.js**: Orchestrates multi-persona discussions. Integrate new discussion flows here.
- **src/services/llmClient.js**: Main LLM interface. Switches between real and mock LLM based on `USE_MOCK_LLM` env var. Always load `dotenv` at the top of service files.
- **src/services/mockLLMClient.js**: Mock LLM for tests and development. Returns canned persona responses.
- **src/utils/metrics.js**: Tracks API calls, token usage, consensus/divergence, and exports analytics.
- **src/utils/tokenCounter.js**: Simple token counting utility. Used for metrics and context management.
- **test/services/llmClient.test.js**: Jest test suite for LLM client. Mocks are managed via `beforeEach`/`afterEach` hooks.

## Developer Workflows
- **Install**: `npm install`
- **Run (dev)**: `npm run dev` (uses nodemon)
- **Test**: `npm test` (Jest, uses mock LLM if `USE_MOCK_LLM=true`)
- **Debug**: Add `console.debug` statements; output is visible in test and dev runs.
- **Environment**: Copy `.env.example` to `.env` and set `GEMINI_API_KEY`. Use `USE_MOCK_LLM=true` for mock mode.
- **VS Code Tasks**: Use "Start Discussion Simulator" and "Run Tests" tasks for quick workflow.

## Project-Specific Patterns & Conventions
- **Persona Pattern**: All agent logic is persona-driven. Extend `src/config/personas.js` for new types and behaviors.
- **Service Switching**: LLM client auto-selects real or mock based on env. Always check `process.env.USE_MOCK_LLM`.
- **Metrics**: Use `MetricsCollector` for all analytics. Export reports via `metrics.exportToJSON()`.
- **Testing**: Always use mock LLM for tests. Restore mocks with hooks, not inline try/finally.
- **Extensibility**: New integrations should go in `src/integrations/` and follow the Integration interface (see TO_BE_CONTINUED.md for future plans).

## Integration Points & External Dependencies
- **LLM API**: Gemini API via `llmClient.js` (requires `GEMINI_API_KEY`).
- **Mock Mode**: All tests and most dev work use `mockLLMClient.js` for speed and reliability.
- **Metrics Export**: Analytics can be exported to JSON for further analysis.

## Example: Adding a Persona
Extend the `personas` array in `src/config/personas.js` and update `getMockResponse` for canned replies. Register new personas in `PersonaRegistry`.

## Example: Adding a Test
Create a new test file in `test/services/` or `test/fixtures/`. Use Jest and mock the LLM client as shown in `llmClient.test.js`.

## Future Directions
See `TO_BE_CONTINUED.md` for planned features: context management, consensus detection, integrations, and advanced metrics.
