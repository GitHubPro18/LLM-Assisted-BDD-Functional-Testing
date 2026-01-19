/**
 * Test-scoped fixtures added by playwright-bdd.
 */
import { BDDConfig } from '../../config/types';
import { BddFileMeta, BddTestMeta } from '../../gen/bddMeta';
import { TestTypeCommon } from '../../playwright/types';
import { StepKeywordFixture } from '../invokeStep';
import { TestInfo } from '@playwright/test';
import { BddAnnotation } from '../bddAnnotation';
type StepFixture = {
    title: string;
};
export type BddFixturesTest = {
    $bddContext: BddContext;
    Given: StepKeywordFixture;
    When: StepKeywordFixture;
    Then: StepKeywordFixture;
    And: StepKeywordFixture;
    But: StepKeywordFixture;
    $bddFileMeta: BddFileMeta;
    $bddTestMeta?: BddTestMeta;
    $tags: string[];
    $test: TestTypeCommon;
    $testInfo: TestInfo;
    $step: StepFixture;
    $uri: string;
    $scenarioHookFixtures: Record<string, unknown>;
    $before: void;
    $after: void;
    $lang: string;
    $applySpecialTags: void;
    $world: unknown;
};
export type BddContext = {
    config: BDDConfig;
    test: TestTypeCommon;
    testInfo: TestInfo;
    lang: string;
    tags: string[];
    step: StepFixture;
    world: unknown;
    bddAnnotation?: BddAnnotation;
};
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & BddFixturesTest, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions & import("./worker").BddFixturesWorker>;
export {};
//# sourceMappingURL=test.d.ts.map