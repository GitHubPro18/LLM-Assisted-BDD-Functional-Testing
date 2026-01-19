/**
 * Scenario level hooks: Before / After.
 *
 * before(async ({ page }) => {})
 */
import { TestInfo } from '@playwright/test';
import { KeyValue } from '../playwright/types';
import { BddContext } from '../run/bddFixtures/test';
type ScenarioHookOptions = {
    name?: string;
    tags?: string;
    timeout?: number;
};
type ScenarioHookBddFixtures = {
    $bddContext: BddContext;
    $tags: string[];
    $testInfo: TestInfo;
};
type ScenarioHookFn<Fixtures, World> = (this: World, fixtures: Fixtures) => unknown;
type ScenarioHookType = 'before' | 'after';
/**
 * When calling Before() / After() you can pass:
 * 1. hook fn
 * 2. tags string + hook fn
 * 3. options object + hook fn
 *
 * See: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/api_reference.md#afteroptions-fn
 */
type ScenarioHookDefinitionArgs<Fixtures, World> = [ScenarioHookFn<Fixtures, World>] | [NonNullable<ScenarioHookOptions['tags']>, ScenarioHookFn<Fixtures, World>] | [ScenarioHookOptions, ScenarioHookFn<Fixtures, World>];
/**
 * Returns Before() / After() functions.
 */
export declare function scenarioHookFactory<TestFixtures extends KeyValue, WorkerFixtures extends KeyValue, World>(type: ScenarioHookType): (...args: ScenarioHookDefinitionArgs<TestFixtures & WorkerFixtures & ScenarioHookBddFixtures, World>) => void;
export declare function runScenarioHooks<Fixtures extends ScenarioHookBddFixtures>(type: ScenarioHookType, fixtures: Fixtures): Promise<void>;
export declare function getScenarioHooksFixtures(): string[];
export {};
//# sourceMappingURL=scenario.d.ts.map