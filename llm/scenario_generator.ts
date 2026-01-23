/**
 * Generates Gherkin scenarios from business requirements.
 * Usage in another module:
 * 1. const template = fs.readFileSync('llm/prompt_template.txt', 'utf8');
 * 2. const result = generateScenarios(req, actions, template);
 * 3. const llmResponse = await llmClient.send(result.prompt);
 * 4. const finalResult = generateScenarios(req, actions, template, llmResponse);
 */
export type ScenarioTag = 'happy' | 'negative';
export interface GeneratedScenario {
  name: string;
  tag: ScenarioTag;
  steps: string[];
  isValid: boolean;
  validationErrors: string[];
}
export interface GenerationResult {
  prompt: string;
  rawGherkin?: string;
  scenarios?: GeneratedScenario[];
}

export function generateScenarios(
  requirement: string,
  allowedActions: string[],
  template: string,
  llmOutput?: string
): GenerationResult {
  const prompt = buildLlmPrompt(requirement, allowedActions, template);
  let scenarios: GeneratedScenario[] | undefined = undefined;
  if (llmOutput) {
    scenarios = parseLlmResponse(llmOutput, allowedActions);
  }
  return {
    prompt,
    rawGherkin: llmOutput,
    scenarios,
  };
}

function buildLlmPrompt(requirement: string, allowedActions: string[], template: string): string {
  // Replace placeholders in template
  let prompt = template;
  prompt = prompt.replace(/\{requirement\}/gi, requirement);
  prompt = prompt.replace(/\{allowedActions\}/gi, allowedActions.join(', '));
  return prompt;
}

function parseLlmResponse(llmOutput: string, allowedActions: string[]): GeneratedScenario[] {
  // Split by 'Scenario:' or '@happy/@negative' tags
  //const scenarioBlocks = llmOutput.split(/(?=Scenario:|@happy|@negative)/g).map(s => s.trim()).filter(Boolean);
  const scenarioBlocks = llmOutput.split(/(?=@happy|@negative)/g).map(s => s.trim()).filter(s => s.startsWith('@happy') || s.startsWith('@negative'));;
  const scenarios: GeneratedScenario[] = [];

  //console.log('Parsed scenario blocks:');
  //console.log(scenarioBlocks);
  
  for (const block of scenarioBlocks) {
    // Extract tag
    let tag: ScenarioTag | undefined;
    if (block.includes('@happy')) tag = 'happy';
    else if (block.includes('@negative')) tag = 'negative';
    /*if (!tag) {
        throw new Error(`Missing scenario tag (@happy or @negative)`);
        }
        */
    // Extract scenario name
    const nameMatch = block.match(/Scenario:\s*(.*)/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    // Extract steps
    const stepLines = block.split(/\r?\n/).filter(l => l.match(/^(Given|When|Then)/));
    const steps = stepLines.map(l => l.trim());
    if (!name || steps.length === 0) {
        continue; // discard malformed blocks
    }
    scenarios.push({
      name,
      tag: tag || 'negative', // default to happy if missing
      steps,
      isValid: false,
      validationErrors: [],
    });
  }
  return scenarios;
}
