/**
 * Worker-scoped fixtures added by playwright-bdd.
 */
import { BDDConfig } from '../../config/types';
export type BddFixturesWorker = {
    $bddConfig: BDDConfig;
    $workerHookFixtures: Record<string, unknown>;
    $beforeAll: void;
    $afterAll: void;
};
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions & BddFixturesWorker>;
//# sourceMappingURL=worker.d.ts.map