/**
 * Class to build and print testMeta object containing meta info about each test.
 * Tests are identified by special key constructed from title path.
 *
 * Example:
 * const bddMetaMap = {
 *  "Simple scenario": { pickleLocation: "3:10", tags: ["@foo"] },
 *  "Scenario with examples|Example #1": { pickleLocation: "8:26", tags: [] },
 *  "Rule 1|Scenario with examples|Example #1": { pickleLocation: "9:42", tags: [] },
 * };
 */
import { TestNode } from './testNode';
import { PickleWithLocation } from '../features/load';
import { TestInfo } from '@playwright/test';
export type BddFileMeta = Record<string, BddTestMeta>;
export type BddTestMeta = {
    pickleLocation: string;
    tags?: string[];
    ownTags?: string[];
};
export declare class BddFileMetaBuilder {
    private tests;
    get testCount(): number;
    registerTest(node: TestNode, pickle: PickleWithLocation): void;
    getObjectLines(): string[];
    private getTestKey;
}
export declare function getBddTestMeta(bddFileMeta: BddFileMeta, testInfo: TestInfo): BddTestMeta | undefined;
//# sourceMappingURL=bddMeta.d.ts.map