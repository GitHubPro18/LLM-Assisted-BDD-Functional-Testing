"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBdd = void 0;
const test_1 = require("../run/bddFixtures/test");
const testTypeImpl_1 = require("../playwright/testTypeImpl");
const exit_1 = require("../utils/exit");
const scenario_1 = require("../hooks/scenario");
const worker_1 = require("../hooks/worker");
const cucumberStyle_1 = require("./cucumberStyle");
const playwrightStyle_1 = require("./playwrightStyle");
// eslint-disable-next-line max-statements, visual/complexity
function createBdd(customTest, options) {
    if (customTest === test_1.test)
        customTest = undefined;
    if (customTest)
        assertTestHasBddFixtures(customTest);
    const BeforeAll = (0, worker_1.workerHookFactory)('beforeAll');
    const AfterAll = (0, worker_1.workerHookFactory)('afterAll');
    const Before = (0, scenario_1.scenarioHookFactory)('before');
    const After = (0, scenario_1.scenarioHookFactory)('after');
    // cucumber-style
    if (options && 'worldFixture' in options && options.worldFixture) {
        if (!customTest) {
            (0, exit_1.exit)(`When using worldFixture, you should provide custom test to createBdd()`);
        }
        const Given = (0, cucumberStyle_1.cucumberStepCtor)('Given', customTest, options.worldFixture);
        const When = (0, cucumberStyle_1.cucumberStepCtor)('When', customTest, options.worldFixture);
        const Then = (0, cucumberStyle_1.cucumberStepCtor)('Then', customTest, options.worldFixture);
        const Step = (0, cucumberStyle_1.cucumberStepCtor)('Unknown', customTest, options.worldFixture);
        return { Given, When, Then, Step, Before, After, BeforeAll, AfterAll };
    }
    // playwright-style
    const Given = (0, playwrightStyle_1.playwrightStepCtor)('Given', customTest);
    const When = (0, playwrightStyle_1.playwrightStepCtor)('When', customTest);
    const Then = (0, playwrightStyle_1.playwrightStepCtor)('Then', customTest);
    const Step = (0, playwrightStyle_1.playwrightStepCtor)('Unknown', customTest);
    return { Given, When, Then, Step, Before, After, BeforeAll, AfterAll };
}
exports.createBdd = createBdd;
function assertTestHasBddFixtures(customTest) {
    if (!(0, testTypeImpl_1.isTestContainsSubtest)(customTest, test_1.test)) {
        (0, exit_1.exit)(`createBdd() should use 'test' extended from "playwright-bdd"`);
    }
}
//# sourceMappingURL=createBdd.js.map