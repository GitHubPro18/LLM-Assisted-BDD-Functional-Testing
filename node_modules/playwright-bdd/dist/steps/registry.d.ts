/**
 * Own step definitions registry.
 */
import { Expression } from '@cucumber/cucumber-expressions';
import { StepConfig } from './stepConfig';
export type GherkinStepKeyword = 'Unknown' | 'Given' | 'When' | 'Then';
export type DefineStepPattern = string | RegExp;
export declare class StepDefinition {
    #private;
    stepConfig: StepConfig;
    constructor(stepConfig: StepConfig);
    get keyword(): GherkinStepKeyword;
    get pattern(): DefineStepPattern;
    get code(): (...args: any[]) => unknown;
    get uri(): string;
    get line(): number;
    get expression(): Expression;
    get patternString(): string;
}
export declare const stepDefinitions: StepDefinition[];
export declare function registerStepDefinition(stepConfig: StepConfig): void;
export declare function findStepDefinition(stepText: string, featureFile: string): StepDefinition | undefined;
//# sourceMappingURL=registry.d.ts.map