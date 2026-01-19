"use strict";
/**
 * Auto-inject fixtures are automatically injected into every step call
 * without explicitly passing them in the last argument of Given() / When() / Then().
 * It just reduces generated code visually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBddAutoInjectFixtures = exports.isBddAutoInjectFixture = void 0;
const BDD_AUTO_INJECT_FIXTURES = {
    $tags: null,
    $test: null,
    $step: null,
    $testInfo: null,
    $bddContext: null,
};
function isBddAutoInjectFixture(name) {
    return Object.hasOwn(BDD_AUTO_INJECT_FIXTURES, name);
}
exports.isBddAutoInjectFixture = isBddAutoInjectFixture;
function getBddAutoInjectFixtures(bddContext) {
    return {
        $testInfo: bddContext.testInfo,
        $tags: bddContext.tags,
        $test: bddContext.test,
        $step: bddContext.step,
        $bddContext: bddContext,
    };
}
exports.getBddAutoInjectFixtures = getBddAutoInjectFixtures;
//# sourceMappingURL=autoInject.js.map