"use strict";
/**
 * Define steps via decorators.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkStepsWithPomNode = exports.createStepDecorator = void 0;
const autoInject_1 = require("../../run/bddFixtures/autoInject");
const getLocationInFile_1 = require("../../playwright/getLocationInFile");
const registry_1 = require("../registry");
// initially we store step data inside method,
// and then extract it in @Fixture decorator call
const decoratedStepSymbol = Symbol('decoratedStep');
/**
 * Creates @Given, @When, @Then decorators.
 */
function createStepDecorator(keyword) {
    return (pattern) => {
        // offset = 3 b/c this call is 3 steps below the user's code
        const location = (0, getLocationInFile_1.getLocationByOffset)(3);
        // context parameter is required for decorator by TS even though it's not used
        return (method, _context) => {
            saveStepConfigToMethod(method, {
                keyword,
                pattern,
                location,
                fn: method,
                // hasCustomTest: true,
            });
        };
    };
}
exports.createStepDecorator = createStepDecorator;
function linkStepsWithPomNode(Ctor, pomNode) {
    if (!Ctor?.prototype)
        return;
    const propertyDescriptors = Object.getOwnPropertyDescriptors(Ctor.prototype);
    return Object.values(propertyDescriptors).forEach((descriptor) => {
        const stepConfig = getStepConfigFromMethod(descriptor);
        if (!stepConfig)
            return;
        stepConfig.pomNode = pomNode;
        registerDecoratorStep(stepConfig);
    });
}
exports.linkStepsWithPomNode = linkStepsWithPomNode;
// todo: link decorator steps with customTest!
function registerDecoratorStep(stepConfig) {
    const { fn } = stepConfig;
    stepConfig.fn = (fixturesArg, ...args) => {
        const fixture = getFirstNonAutoInjectFixture(fixturesArg, stepConfig);
        return fn.call(fixture, ...args);
    };
    (0, registry_1.registerStepDefinition)(stepConfig);
}
function getFirstNonAutoInjectFixture(fixturesArg, stepConfig) {
    // there should be exatcly one suitable fixture in fixturesArg
    const fixtureNames = Object.keys(fixturesArg).filter((fixtureName) => !(0, autoInject_1.isBddAutoInjectFixture)(fixtureName));
    if (fixtureNames.length === 0) {
        throw new Error(`No suitable fixtures found for decorator step "${stepConfig.pattern}"`);
    }
    if (fixtureNames.length > 1) {
        throw new Error(`Several suitable fixtures found for decorator step "${stepConfig.pattern}"`);
    }
    return fixturesArg[fixtureNames[0]];
}
function saveStepConfigToMethod(method, stepConfig) {
    method[decoratedStepSymbol] = stepConfig;
}
function getStepConfigFromMethod(descriptor) {
    // filter out getters / setters
    return typeof descriptor.value === 'function'
        ? descriptor.value[decoratedStepSymbol]
        : undefined;
}
//# sourceMappingURL=steps.js.map