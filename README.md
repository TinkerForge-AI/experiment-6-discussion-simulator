# Experiment 6: Discussion Simulator

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your `GEMINI_API_KEY` if using real LLM.
3. Run in development mode:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Project Structure
- `src/index.js`: Entry point
- `src/config/personas.js`: Persona definitions
- `src/core/moderator.js`: Orchestration logic
- `src/services/llmClient.js`: LLM interface
- `src/services/mockLLMClient.js`: Mock LLM for testing
- `src/utils/tokenCounter.js`: Token management
- `src/utils/metrics.js`: Discussion metrics
- `src/integrations/`: Ready for future integrations
- `test/fixtures/responses.js`: Canned responses for tests
- `.env.example`: Environment variable template

## Notes
- Uses `dotenv`, `chalk`, `inquirer`, `jest`.
- Dev tools: `nodemon`, `@types/node`.
