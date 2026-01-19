import * as fs from 'fs';
import { GeneratedScenario } from '../../llm/scenario_generator.js';

/**
 * Writes approved scenarios to a Gherkin feature file.
 * @param scenarios Array of approved GeneratedScenario objects
 * @param featureName Name of the feature
 * @param filePath Path to the output .feature file
 */
export function writeFeatureFile(
  scenarios: GeneratedScenario[],
  featureName: string = 'Generated Feature',
  filePath: string = __dirname + '/generated.feature'
): void {
  let content = `Feature: ${featureName}\n\n`;
  for (const scenario of scenarios) {
    content += `${scenario.tag ? '@' + scenario.tag : ''}\n`;
    content += `Scenario: ${scenario.name}\n`;
    for (const step of scenario.steps) {
      content += `${step}\n`;
    }
    content += '\n';
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}
