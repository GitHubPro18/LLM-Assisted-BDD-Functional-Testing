/**
 * Bdd data is a special annotation with test meta data, needed for Cucumber reporting.
 *
 * Previously we used attachment for that, but annotation is better:
 * it allows to update data synchronously, while attachment needs
 * to be asynchronously attached in teardown phase that may not run.
 * See: https://github.com/microsoft/playwright/issues/30175
 */
import { TestInfo } from '@playwright/test';
import { BddTestMeta } from '../../gen/bddMeta';
import { TestCase } from '@playwright/test/reporter';
import { PlaywrightLocation } from '../../playwright/types';
import { BddData } from './types';
import { StepDefinition } from '../../steps/registry';
export declare class BddAnnotation {
    private testInfo;
    private data;
    constructor(testInfo: TestInfo, { pickleLocation }: BddTestMeta, uri: string);
    registerStep(stepDefinition: StepDefinition, stepText: string, pwStepLocation: PlaywrightLocation): void;
    private save;
}
export declare function getBddDataFromTest({ annotations }: TestCase): {
    bddData: BddData | undefined;
    annotationIndex: number;
};
//# sourceMappingURL=index.d.ts.map