/**
 * Class to invoke step in playwright runner.
 */
import { PickleStepArgument } from '@cucumber/messages';
import { BddContext } from './bddFixtures/test';
type StepKeyword = 'Given' | 'When' | 'Then' | 'And' | 'But';
export type StepKeywordFixture = ReturnType<typeof createStepInvoker>;
export declare function createStepInvoker(bddContext: BddContext, keyword: StepKeyword): (stepText: string, argument?: PickleStepArgument | null | undefined, stepFixtures?: Record<string, unknown> | undefined) => Promise<void>;
export {};
//# sourceMappingURL=invokeStep.d.ts.map