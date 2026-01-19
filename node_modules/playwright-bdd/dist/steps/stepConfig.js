"use strict";
/**
 * Playwright-bdd step config.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCucumberStyleStep = exports.isDecorator = void 0;
/**
 * Decorator steps have pom node.
 */
function isDecorator(stepConfig) {
    return Boolean(stepConfig?.pomNode);
}
exports.isDecorator = isDecorator;
/**
 * New cucumber-style steps have worldFixture in step config.
 */
function isCucumberStyleStep(stepConfig) {
    return Boolean(stepConfig?.worldFixture);
}
exports.isCucumberStyleStep = isCucumberStyleStep;
//# sourceMappingURL=stepConfig.js.map