"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playwrightStepCtor = void 0;
const fixtureParameterNames_1 = require("../playwright/fixtureParameterNames");
const getLocationInFile_1 = require("../playwright/getLocationInFile");
const registry_1 = require("./registry");
function playwrightStepCtor(keyword, customTest) {
    return (pattern, fn) => {
        (0, registry_1.registerStepDefinition)({
            keyword,
            pattern,
            fn,
            location: (0, getLocationInFile_1.getLocationByOffset)(3),
            customTest,
        });
        return getCallableStepFn(pattern, fn);
    };
}
exports.playwrightStepCtor = playwrightStepCtor;
/**
 * Returns wrapped step function to be called from other steps.
 * See: https://github.com/vitalets/playwright-bdd/issues/110
 */
function getCallableStepFn(pattern, fn) {
    // need Partial<...> here, otherwise TS requires all Playwright fixtures to be passed
    return (fixtures, ...args) => {
        assertStepIsCalledWithRequiredFixtures(pattern, fn, fixtures);
        return fn(fixtures, ...args);
    };
}
function assertStepIsCalledWithRequiredFixtures(pattern, fn, passedFixtures) {
    const requiredFixtures = (0, fixtureParameterNames_1.fixtureParameterNames)(fn);
    const missingFixtures = requiredFixtures.filter((fixtureName) => !Object.hasOwn(passedFixtures, fixtureName));
    if (missingFixtures.length) {
        throw new Error([
            `Invocation of step "${pattern}" from another step does not pass all required fixtures.`,
            `Missing fixtures: ${missingFixtures.join(', ')}`,
        ].join(' '));
    }
}
//# sourceMappingURL=playwrightStyle.js.map