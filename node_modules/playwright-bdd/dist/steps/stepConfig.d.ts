/**
 * Playwright-bdd step config.
 */
import { PlaywrightLocation, TestTypeCommon } from '../playwright/types';
import { PomNode } from './decorators/pomGraph';
import { DefineStepPattern, GherkinStepKeyword } from './registry';
export type StepConfig = {
    keyword: GherkinStepKeyword;
    pattern: DefineStepPattern;
    fn: (...args: any[]) => unknown;
    location: PlaywrightLocation;
    customTest?: TestTypeCommon;
    pomNode?: PomNode;
    worldFixture?: string;
};
/**
 * Decorator steps have pom node.
 */
export declare function isDecorator(stepConfig?: StepConfig): stepConfig is StepConfig & {
    pomNode: PomNode;
};
/**
 * New cucumber-style steps have worldFixture in step config.
 */
export declare function isCucumberStyleStep(stepConfig?: StepConfig): stepConfig is StepConfig & {
    worldFixture: string;
};
//# sourceMappingURL=stepConfig.d.ts.map