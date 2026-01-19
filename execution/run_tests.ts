// Test Execution Orchestrator
// Runs the full workflow: generation, validation, approval, feature writing, execution, reporting
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { generateScenarios } from '../llm/scenario_generator.js';
import { validateScenariosAndWriteReport } from '../validation/scenario_validator.js';
import { getApprovedScenarios } from '../approval/approval_gate.js';
import { writeFeatureFile } from '../bdd/features/write_feature_file.js';
import { OpenAILlmClient } from '../llm/llm_client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
	// 1. Load business requirements
	const reqPath = path.join(__dirname, '..', 'requirements', 'business_requirements.txt');
	const requirements = fs.readFileSync(reqPath, 'utf8').split(/\r?\n/).filter(Boolean);

	// 2. Load allowed actions
	const allowedActionsPath = path.join(__dirname, '..', 'validation', 'allowed_actions.json');
	const allowedActions = JSON.parse(fs.readFileSync(allowedActionsPath, 'utf8')).allowedActions;

	// 3. Load LLM prompt template
	const templatePath = path.join(__dirname, '..', 'llm', 'prompt_template.txt');
	const template = fs.readFileSync(templatePath, 'utf8');

	// 4. Generate scenarios 
	const llmClient = new OpenAILlmClient();

	let allGenerated = [];
	for (const req of requirements) {
		const {prompt} = generateScenarios(req, allowedActions, template);

        const llmOutput = await llmClient.send(prompt);
        const {scenarios} = generateScenarios(req, allowedActions, template, llmOutput);    
        if(!scenarios || scenarios.length === 0) {
            console.warn(`⚠️ No valid scenarios generated for requirement: ${req}`);
            continue;
        }
        allGenerated.push(...scenarios);
		// In real use, send result.prompt to LLM and get llmOutput, then:
		// const finalResult = generateScenarios(req, allowedActions, template, llmOutput);
		// For demo, skip LLM call and continue
		//if (result.scenarios) allGenerated.push(...result.scenarios);
	}

	// 5. Validate scenarios
	const validated = validateScenariosAndWriteReport(allGenerated, allowedActions);
	// Merge validation results into scenarios for approval
	const scenariosWithValidation = allGenerated.map(s => {
		const v = validated.find(vr => vr.name === s.name && vr.tag === s.tag);
        if (!v) {
            throw new Error(`Missing validation result for scenario: ${s.name}`);
            }
        return { ...s, ...v };
		//return { ...s, ...v };
	});

	// 6. Manual approval gate
	const approverId = process.env.USER || process.env.USERNAME || 'approver';
	const { approvedScenarios, approvalLog } = await getApprovedScenarios(scenariosWithValidation, approverId);

	if (!approvedScenarios.length) {
		console.log('No scenarios approved. Aborting execution.');
		process.exit(0);
	}

	// 7. Write approved scenarios to feature file
	const featurePath = path.join(__dirname, '..', 'bdd', 'features', 'generated.feature');
	const sanitizedScenarios = approvedScenarios.map(s => ({...s,steps: s.steps.map(step =>step.replace(/".*?"/g, '').trim())}));


	// 8. Execute Playwright-BDD via CLI
	//const { execSync } = require('child_process');

    
	let executionReport = { pass: false, error: '' };

	try {
		execSync('npx playwright test', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
		executionReport.pass = true;
	} catch (err) {
		executionReport.error = err instanceof Error ? err.message : String(err);
	}
	// 9. Write execution report
	const execReportPath = path.join(__dirname, '..', 'reports', 'execution_report.json');
	const execReportObj = {
		timestamp: new Date().toISOString(),
		...executionReport
	};
	fs.writeFileSync(execReportPath, JSON.stringify(execReportObj, null, 2), 'utf8');
	console.log('Execution report written to reports/execution_report.json');
}

main();