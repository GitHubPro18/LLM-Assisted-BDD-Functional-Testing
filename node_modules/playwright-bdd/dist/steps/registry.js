"use strict";
/**
 * Own step definitions registry.
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _StepDefinition_expression;
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStepDefinition = exports.registerStepDefinition = exports.stepDefinitions = exports.StepDefinition = void 0;
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const parameterTypes_1 = require("./parameterTypes");
const paths_1 = require("../utils/paths");
const exit_1 = require("../utils/exit");
// todo: merge with StepConfig to have single class
class StepDefinition {
    constructor(stepConfig) {
        this.stepConfig = stepConfig;
        _StepDefinition_expression.set(this, void 0);
    }
    get keyword() {
        return this.stepConfig.keyword;
    }
    get pattern() {
        return this.stepConfig.pattern;
    }
    get code() {
        return this.stepConfig.fn;
    }
    get uri() {
        return this.stepConfig.location.file;
    }
    get line() {
        return this.stepConfig.location.line;
    }
    get expression() {
        // create expression lazily b/c we need all parameter types to be loaded
        if (!__classPrivateFieldGet(this, _StepDefinition_expression, "f")) {
            __classPrivateFieldSet(this, _StepDefinition_expression, typeof this.pattern === 'string'
                ? new cucumber_expressions_1.CucumberExpression(this.pattern, parameterTypes_1.parameterTypeRegistry)
                : new cucumber_expressions_1.RegularExpression(this.pattern, parameterTypes_1.parameterTypeRegistry), "f");
        }
        return __classPrivateFieldGet(this, _StepDefinition_expression, "f");
    }
    get patternString() {
        return typeof this.pattern === 'string' ? this.pattern : this.pattern.source;
    }
}
exports.StepDefinition = StepDefinition;
_StepDefinition_expression = new WeakMap();
exports.stepDefinitions = [];
function registerStepDefinition(stepConfig) {
    const stepDefinition = new StepDefinition(stepConfig);
    exports.stepDefinitions.push(stepDefinition);
}
exports.registerStepDefinition = registerStepDefinition;
// todo: don't call exit here, call it upper
function findStepDefinition(stepText, featureFile) {
    const matchedSteps = exports.stepDefinitions.filter((step) => {
        return Boolean(step.expression.match(stepText));
    });
    if (matchedSteps.length === 0)
        return;
    if (matchedSteps.length > 1) {
        (0, exit_1.exit)(formatDuplicateStepsError(stepText, featureFile, matchedSteps));
    }
    return matchedSteps[0];
}
exports.findStepDefinition = findStepDefinition;
function formatDuplicateStepsError(stepText, featureFile, matchedSteps) {
    const stepLines = matchedSteps.map((step) => {
        const file = step.uri ? (0, paths_1.relativeToCwd)(step.uri) : '';
        return `  ${step.patternString} - ${file}:${step.line}`;
    });
    return [
        `Multiple step definitions matched for text: "${stepText}" (${featureFile})`,
        ...stepLines,
    ].join('\n');
}
//# sourceMappingURL=registry.js.map