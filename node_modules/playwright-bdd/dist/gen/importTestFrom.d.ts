/**
 * Guess import test from by used steps.
 */
import { StepDefinition } from '../steps/registry';
import { ImportTestFrom } from './formatter';
export declare class ImportTestFromGuesser {
    private featureUri;
    private usedStepDefinitions;
    private usedDecoratorFixtures;
    private customTestsSet;
    constructor(featureUri: string, usedStepDefinitions: Set<StepDefinition>, usedDecoratorFixtures: Set<string>);
    guess(): ImportTestFrom | undefined;
    private fillCustomTestsFromRegularSteps;
    private fillCustomTestsFromDecoratorSteps;
    private getUsedCustomTestsCount;
    private findTopmostTest;
    private getExportedTestInfo;
    private throwCantGuessError;
}
//# sourceMappingURL=importTestFrom.d.ts.map