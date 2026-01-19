"use strict";
/**
 * Scenario level hooks: Before / After.
 *
 * before(async ({ page }) => {})
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScenarioHooksFixtures = exports.runScenarioHooks = exports.scenarioHookFactory = void 0;
const tag_expressions_1 = __importDefault(require("@cucumber/tag-expressions"));
const fixtureParameterNames_1 = require("../playwright/fixtureParameterNames");
const utils_1 = require("../utils");
const getLocationInFile_1 = require("../playwright/getLocationInFile");
const runStepWithLocation_1 = require("../playwright/runStepWithLocation");
const scenarioHooks = [];
let scenarioHooksFixtures;
/**
 * Returns Before() / After() functions.
 */
function scenarioHookFactory(type) {
    return (...args) => {
        addHook({
            type,
            options: getOptionsFromArgs(args),
            // fn: getFnFromArgs(args) as ScenarioHook<AllFixtures, World>['fn'],
            fn: getFnFromArgs(args),
            // offset = 3 b/c this call is 3 steps below the user's code
            location: (0, getLocationInFile_1.getLocationByOffset)(3),
        });
    };
}
exports.scenarioHookFactory = scenarioHookFactory;
// eslint-disable-next-line visual/complexity
async function runScenarioHooks(type, fixtures) {
    let error;
    for (const hook of scenarioHooks) {
        if (hook.type !== type)
            continue;
        if (hook.tagsExpression && !hook.tagsExpression.evaluate(fixtures.$tags))
            continue;
        try {
            const hookFn = wrapHookFn(hook, fixtures);
            await (0, runStepWithLocation_1.runStepWithLocation)(fixtures.$bddContext.test, hook.options.name || '', hook.location, hookFn);
        }
        catch (e) {
            if (type === 'before')
                throw e;
            if (!error)
                error = e;
        }
    }
    if (error)
        throw error;
}
exports.runScenarioHooks = runScenarioHooks;
function getScenarioHooksFixtures() {
    if (!scenarioHooksFixtures) {
        const fixtureNames = new Set();
        scenarioHooks.forEach((hook) => {
            (0, fixtureParameterNames_1.fixtureParameterNames)(hook.fn).forEach((fixtureName) => fixtureNames.add(fixtureName));
        });
        const excludeFixtureNames = {
            $bddContext: null,
            $tags: null,
            $testInfo: null,
        };
        Object.keys(excludeFixtureNames).forEach((fixtureName) => fixtureNames.delete(fixtureName));
        scenarioHooksFixtures = [...fixtureNames];
    }
    return scenarioHooksFixtures;
}
exports.getScenarioHooksFixtures = getScenarioHooksFixtures;
/**
 * Wraps hook fn with timeout and waiting Cucumber attachments to fulfill.
 */
function wrapHookFn(hook, fixtures) {
    const { timeout } = hook.options;
    const { $bddContext } = fixtures;
    return async () => {
        await (0, utils_1.callWithTimeout)(() => hook.fn.call($bddContext.world, fixtures), timeout, getTimeoutMessage(hook));
    };
}
function getOptionsFromArgs(args) {
    if (typeof args[0] === 'string')
        return { tags: args[0] };
    if (typeof args[0] === 'object')
        return args[0];
    return {};
}
function getFnFromArgs(args) {
    return args.length === 1 ? args[0] : args[1];
}
function setTagsExpression(hook) {
    if (hook.options.tags) {
        hook.tagsExpression = (0, tag_expressions_1.default)(hook.options.tags);
    }
}
function addHook(hook) {
    setTagsExpression(hook);
    if (hook.type === 'before') {
        scenarioHooks.push(hook);
    }
    else {
        // 'after' hooks run in reverse order
        scenarioHooks.unshift(hook);
    }
}
function getTimeoutMessage(hook) {
    const { timeout, name: hookName } = hook.options;
    return `${hook.type} hook ${hookName ? `"${hookName}" ` : ''}timeout (${timeout} ms)`;
}
//# sourceMappingURL=scenario.js.map