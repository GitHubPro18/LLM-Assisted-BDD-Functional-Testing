/**
 * Auto-inject fixtures are automatically injected into every step call
 * without explicitly passing them in the last argument of Given() / When() / Then().
 * It just reduces generated code visually.
 */
import { BddContext, BddFixturesTest } from './test';
export type BddAutoInjectFixtures = Pick<BddFixturesTest, '$test' | '$tags' | '$step' | '$testInfo' | '$bddContext'>;
export declare function isBddAutoInjectFixture(name: string): boolean;
export declare function getBddAutoInjectFixtures(bddContext: BddContext): BddAutoInjectFixtures;
//# sourceMappingURL=autoInject.d.ts.map