import * as fs from 'fs';
import * as path from 'path';
import { ScenarioTag } from '../llm/scenario_generator.js';
import { fileURLToPath } from 'url';


// Scenario Validator Module
// Validates Gherkin scenarios for syntax and allowed actions

import { GeneratedScenario } from '../llm/scenario_generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export interface ValidationResult {
  name: string;
  tag: ScenarioTag;
  isValid: boolean;
  errors: string[];
}

export function validateScenario(
  scenario: GeneratedScenario,
  allowedActions: string[]
): ValidationResult {
  const errors: string[] = [];

  // 1. Valid Gherkin syntax: Each step must start with Given/When/Then
  for (const step of scenario.steps) {
    if (!/^(Given|When|Then)\s+.+/.test(step)) {
      errors.push(`Invalid Gherkin step: "${step}"`);
    }
  }

  // 2. Only allowedActions used (longest match at start of step after keyword)
  const allowed = allowedActions.map(a => a.toLowerCase()).sort((a, b) => b.length - a.length);
  for (const step of scenario.steps) {
    const match = step.match(/^(Given|When|Then)\s+(.+)/);
    if (match) {
      const stepText = match[2].trim().toLowerCase();
      let found = false;
      for (const action of allowed) {
        if (stepText.startsWith(action)) {
          found = true;
          break;
        }
      }
      if (!found) {
        errors.push(`Disallowed action phrase in step: "${step}"`);
      }
    }
  }

  // 3. Exactly one Then step
  const thenSteps = scenario.steps.filter(s => s.startsWith('Then'));
  if (thenSteps.length !== 1) {
    errors.push('Scenario must have exactly one Then step');
  }

  return {
    name: scenario.name,
    tag: scenario.tag,
    isValid: errors.length === 0,
    errors,
  };
}

export function validateScenariosAndWriteReport(
  scenarios: GeneratedScenario[],
  allowedActions: string[]
): ValidationResult[] {
  const results = scenarios.map(s => validateScenario(s, allowedActions));
  const reportPath = path.join(
    __dirname,
    '..',
    'reports',
    'validation_report.json'
  );
  const report = {
    timestamp: new Date().toISOString(),
    results
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  return results;
}
