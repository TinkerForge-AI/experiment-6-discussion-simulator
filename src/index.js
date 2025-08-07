require('dotenv').config();
const chalk = require('chalk');
const inquirer = require('inquirer');
const { personas, PersonaRegistry } = require('./config/personas');
const PersonaSelector = require('./core/personaSelector');
const Moderator = require('./core/moderator');
const { callLLM, metrics } = require('./services/llmClient');

// Check for --mock flag
const useMock = process.argv.includes('--mock') || process.env.USE_MOCK_LLM === 'true';
if (useMock) {
	process.env.USE_MOCK_LLM = 'true';
	console.log(chalk.yellow.bold('*** Mock Mode Enabled: Using canned test data ***'));
}

async function main() {
	console.log(chalk.green('Discussion Simulator Started'));
	// Problem input
	const { problem } = await inquirer.prompt({
		type: 'input',
		name: 'problem',
		message: 'Enter the problem to discuss:'
	});

	// Persona selection (recommended)
	const selector = new PersonaSelector(personas);
	const recommended = selector.analyzeRelevance(problem, personas);
	console.log(chalk.cyan('Recommended personas:'));
	recommended.forEach(p => console.log(`- ${p.name} (${p.description})`));

	const { selectedIds } = await inquirer.prompt({
		type: 'checkbox',
		name: 'selectedIds',
		message: 'Select personas for discussion:',
		choices: personas.map(p => ({ name: `${p.name} (${p.description})`, value: p.id, checked: recommended.includes(p) }))
	});
	const selectedPersonas = personas.filter(p => selectedIds.includes(p.id));

	// Enable/disable cross-talk
	const { enableCrossTalk } = await inquirer.prompt({
		type: 'confirm',
		name: 'enableCrossTalk',
		message: 'Enable cross-talk between personas?',
		default: true
	});

	// Run discussion
	const moderator = new Moderator(selectedPersonas, enableCrossTalk, metrics);
	metrics.startRound();
	const initialResponses = await moderator.runInitialRound(problem, callLLM);
	console.log(chalk.magenta('\nInitial Responses:'));
	initialResponses.forEach(({ persona, response }) => {
		const color = persona.id === 'PRAG' ? chalk.blue : persona.id === 'PESS' ? chalk.red : chalk.green;
		console.log(color(`\n${persona.name}:`));
		console.log(color(response));
	});

	let crossTalkResponses = [];
	if (enableCrossTalk) {
		crossTalkResponses = await moderator.runCrossTalk(initialResponses, callLLM);
		console.log(chalk.magenta('\nCross-Talk Responses:'));
		crossTalkResponses.forEach(({ respondingPersona, crossResponse }) => {
			const color = respondingPersona.id === 'PRAG' ? chalk.blue : respondingPersona.id === 'PESS' ? chalk.red : chalk.green;
			console.log(color(`\n${respondingPersona.name}:`));
			console.log(color(crossResponse));
		});
	}
	metrics.endRound();

	// Show metrics
	const report = metrics.generateReport();
	console.log(chalk.yellow('\nDiscussion Metrics:'));
	console.log(report);
}

main();
