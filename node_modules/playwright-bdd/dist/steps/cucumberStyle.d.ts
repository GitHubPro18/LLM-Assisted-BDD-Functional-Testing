/**
 * New cucumber-style steps where Given/When/Then are not imported from Cucumber.
 * Instead they are imported as:
 * const { Given, When, Then } = createBdd(test, { worldFixture: 'world' });
 */
import { StepConfig } from './stepConfig';
import { DefineStepPattern, GherkinStepKeyword } from './registry';
import { TestTypeCommon } from '../playwright/types';
export type CucumberStyleStepFn<World> = (this: World, ...args: any[]) => unknown;
export declare function cucumberStepCtor<StepFn extends StepConfig['fn']>(keyword: GherkinStepKeyword, customTest: TestTypeCommon, worldFixture: string): (pattern: DefineStepPattern, fn: StepFn) => StepFn;
//# sourceMappingURL=cucumberStyle.d.ts.map