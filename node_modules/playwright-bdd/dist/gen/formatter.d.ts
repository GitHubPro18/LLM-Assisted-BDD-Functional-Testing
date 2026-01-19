/**
 * Helper to format Playwright test file.
 */
import { PickleStepArgument } from '@cucumber/messages';
import { TestNode } from './testNode';
import { BddFileMetaBuilder } from './bddMeta';
import { BDDConfig } from '../config/types';
export type ImportTestFrom = {
    file: string;
    varName?: string;
};
export declare class Formatter {
    private config;
    constructor(config: BDDConfig);
    fileHeader(featureUri: string, importTestFrom?: ImportTestFrom): string[];
    describe(node: TestNode, children: string[]): string[];
    beforeEach(fixtures: Set<string>, children: string[]): string[];
    test(node: TestNode, fixtures: Set<string>, children: string[]): string[];
    step(keyword: string, text: string, argument?: PickleStepArgument, fixtureNames?: string[]): string;
    missingStep(keyword: string, text: string): string;
    technicalSection(bddFileMetaBuilder: BddFileMetaBuilder, featureUri: string, fixtures: string[]): string[];
    scenarioHookFixtures(fixtureNames: string[]): string[];
    workerHookFixtures(fixtureNames: string[]): string[];
    setWorldFixture(worldFixtureName: string): string[];
    langFixture(lang: string): string[];
    private getFunction;
    private describeConfigure;
    private wrapInAnonymousDescribe;
    private markAsFailing;
    private testTags;
    /**
     * Apply this function only to string literals (mostly titles here).
     * Objects and arrays are handled with JSON.strinigfy,
     * b/c object keys can't be in backticks.
     * See: https://stackoverflow.com/questions/33194138/template-string-as-object-property-name
     */
    private quoted;
}
//# sourceMappingURL=formatter.d.ts.map