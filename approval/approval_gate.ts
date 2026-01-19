import * as fs from 'fs';
import * as path from 'path';
//import * as path from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline/promises';
import { GeneratedScenario } from '../llm/scenario_generator.js';
import { ValidationResult } from '../validation/scenario_validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export interface ApprovalRecord {
  scenarioName: string;
  approverId: string;
  approved: boolean;
  timestamp: string;
}

/**
 * Main approval workflow:
 * const validated = validateScenariosAndWriteReport(generated.scenarios, actions);
 * const { approvedScenarios, approvalLog } = await getApprovedScenarios(validated, "tester1");
 * // Only approvedScenarios go to Playwright execution
 */
export async function getApprovedScenarios(
  validatedScenarios: (GeneratedScenario & ValidationResult)[],
  approverId: string
): Promise<{
  approvedScenarios: GeneratedScenario[];
  approvalLog: ApprovalRecord[];
}> {
  // 1. FILTER: Only happy and valid
  const eligible = validatedScenarios.filter(s => s.tag === 'happy' && s.isValid === true);
  if (eligible.length === 0) {
    console.log('No eligible happy/valid scenarios for approval.');
  } else {
    console.log(`Found ${eligible.length} eligible happy/valid scenarios:`);
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const approvalLog: ApprovalRecord[] = [];
  const approvedScenarios: GeneratedScenario[] = [];
  for (const scenario of eligible) {
    const answer = await rl.question(`Approve "${scenario.name}"? (y/n): `);
    const approved = answer.trim().toLowerCase() === 'y';
    approvalLog.push({
      scenarioName: scenario.name,
      approverId,
      approved,
      timestamp: new Date().toISOString()
    });
    if (approved) {
      approvedScenarios.push(scenario);
    }
  }
  rl.close();
  // Write approval log
  const reportPath = path.join(__dirname, '..', 'reports', 'approval_log.json');
  const report = {
    timestamp: new Date().toISOString(),
    approvalLog
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('Approval log written to reports/approval_log.json');
  return { approvedScenarios, approvalLog };
}

// Helper for single scenario (not exported as main)
export async function requestApproval(scenarioName: string, approverId: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await rl.question(`Approve "${scenarioName}"? (y/n): `);
  rl.close();
  return answer.trim().toLowerCase() === 'y';
}
