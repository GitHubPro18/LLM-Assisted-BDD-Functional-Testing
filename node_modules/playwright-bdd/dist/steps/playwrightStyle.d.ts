/**
 * Playwright-style steps.
 */
import { KeyValue, TestTypeCommon } from '../playwright/types';
import { StepConfig } from './stepConfig';
import { ParametersExceptFirst } from '../utils/types';
import { DefineStepPattern, GherkinStepKeyword } from './registry';
export type PlaywrightStyleStepFn<T extends KeyValue, W extends KeyValue> = (fixtures: T & W, ...args: any[]) => unknown;
export declare function playwrightStepCtor<StepFn extends StepConfig['fn']>(keyword: GherkinStepKeyword, customTest?: TestTypeCommon): (pattern: DefineStepPattern, fn: StepFn) => (fixtures: Partial<Parameters<StepFn>[0]>, ...args: ParametersExceptFirst<StepFn>) => unknown;
//# sourceMappingURL=playwrightStyle.d.ts.map