"use strict";
/**
 * Class to invoke step in playwright runner.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStepInvoker = void 0;
const getLocationInFile_1 = require("../playwright/getLocationInFile");
const lang_1 = require("../config/lang");
const DataTable_1 = require("../cucumber/DataTable");
const autoInject_1 = require("./bddFixtures/autoInject");
const registry_1 = require("../steps/registry");
const runStepWithLocation_1 = require("../playwright/runStepWithLocation");
function createStepInvoker(bddContext, keyword) {
    const invoker = new StepInvoker(bddContext, keyword);
    return invoker.invoke.bind(invoker);
}
exports.createStepInvoker = createStepInvoker;
class StepInvoker {
    constructor(bddContext, keyword) {
        this.bddContext = bddContext;
        this.keyword = keyword;
    }
    /**
     * Invokes particular step.
     * See: https://github.com/cucumber/cucumber-js/blob/main/src/runtime/test_case_runner.ts#L299
     */
    async invoke(stepText, argument, stepFixtures) {
        const stepDefinition = this.getStepDefinition(stepText);
        // Get location of step call in generated test file.
        // This call must be exactly here to have correct call stack (before async calls)
        const location = (0, getLocationInFile_1.getLocationInFile)(this.bddContext.testInfo.file);
        const stepTitle = this.getStepTitle(stepText);
        const parameters = await this.getStepParameters(stepDefinition, stepText, argument || undefined);
        const fixturesArg = Object.assign({}, stepFixtures, (0, autoInject_1.getBddAutoInjectFixtures)(this.bddContext));
        this.bddContext.bddAnnotation?.registerStep(stepDefinition, stepText, location);
        // update step title to be accessible via $step.title
        this.bddContext.step.title = stepText;
        await (0, runStepWithLocation_1.runStepWithLocation)(this.bddContext.test, stepTitle, location, () => {
            // Although pw-style does not expect usage of world / this in steps,
            // some projects request it for better migration process from cucumber.
            // Here, for pw-style we pass empty object as world.
            // See: https://github.com/vitalets/playwright-bdd/issues/208
            return stepDefinition.code.call(this.bddContext.world, fixturesArg, ...parameters);
        });
    }
    getStepDefinition(text) {
        const stepDefinition = (0, registry_1.findStepDefinition)(text, 
        // todo: change to feature uri
        this.bddContext.testInfo.file);
        if (!stepDefinition) {
            throw new Error(`Undefined step: "${text}"`);
        }
        return stepDefinition;
    }
    async getStepParameters(stepDefinition, text, argument) {
        const parameters = await Promise.all(
        // todo: pass World arg.getValue instead of null
        // todo: optimize to re-use matches from finding step definitions
        stepDefinition.expression.match(text).map((arg) => arg.getValue(null)));
        if (argument?.dataTable) {
            parameters.push(new DataTable_1.DataTable(argument.dataTable));
        }
        else if (argument?.docString) {
            parameters.push(argument.docString.content);
        }
        // todo: handle invalid code length
        // see: https://github.com/cucumber/cucumber-js/blob/main/src/models/step_definition.ts#L25
        return parameters;
    }
    getStepTitle(text) {
        // Currently prepend keyword only for English.
        // For other langs it's more complex as we need to pass original keyword from step.
        return (0, lang_1.isEnglish)(this.bddContext.lang) ? `${this.keyword} ${text}` : text;
    }
}
//# sourceMappingURL=invokeStep.js.map