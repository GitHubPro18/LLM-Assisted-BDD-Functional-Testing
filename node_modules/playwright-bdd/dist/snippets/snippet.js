"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snippet = void 0;
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const parameterTypes_1 = require("../steps/parameterTypes");
const keywordType_1 = require("../cucumber/keywordType");
class Snippet {
    constructor(stepInfo, options) {
        this.stepInfo = stepInfo;
        this.options = options;
        this.generatedExpression = this.generateExpression();
        this.code = this.options.isDecorator ? this.buildDecoratorCode() : this.buildCode();
    }
    get pickleStep() {
        return this.stepInfo.pickleStep;
    }
    buildCode() {
        const stepType = this.getStepType();
        const pattern = this.getPattern();
        const stepFn = this.getStepFunction();
        return [
            `${stepType}(${pattern}, ${stepFn}`, // prettier-ignore
            `  // ...`,
            '});',
        ].join('\n');
    }
    buildDecoratorCode() {
        const stepType = this.getStepType();
        const pattern = this.getPattern();
        return `@${stepType}(${pattern})`;
    }
    getStepType() {
        switch (this.stepInfo.keywordType) {
            case keywordType_1.KeywordType.Event:
                return 'When';
            case keywordType_1.KeywordType.Outcome:
                return 'Then';
            case keywordType_1.KeywordType.Precondition:
            default:
                return 'Given';
        }
    }
    getPattern() {
        return `'${escapeSpecialCharacters(this.generatedExpression.source)}'`;
    }
    getStepFunction() {
        const args = this.getStepFunctionArguments().join(', ');
        return this.options.isPlaywrightStyle
            ? `async (${args}) => {` // prettier-ignore
            : `async function (${args}) {`;
    }
    getStepFunctionArguments() {
        return [
            this.options.isPlaywrightStyle ? '{}' : '',
            ...this.getPatternArguments(),
            this.getLastArgument(),
        ].filter(Boolean);
    }
    getPatternArguments() {
        return this.generatedExpression.parameterNames.map((name, i) => {
            const argName = `arg${i === 0 ? '' : i}`;
            const type = name.startsWith('string') ? 'string' : 'number';
            return this.options.isTypeScript ? `${argName}: ${type}` : argName;
        });
    }
    getLastArgument() {
        const { argument } = this.pickleStep;
        if (!argument)
            return;
        const [argName, type] = argument.dataTable
            ? ['dataTable', 'DataTable']
            : ['docString', 'string'];
        return this.options.isTypeScript ? `${argName}: ${type}` : argName;
    }
    generateExpression() {
        const cucumberExpressionGenerator = new cucumber_expressions_1.CucumberExpressionGenerator(() => parameterTypes_1.parameterTypeRegistry.parameterTypes);
        const generatedExpressions = cucumberExpressionGenerator.generateExpressions(this.pickleStep.text);
        // Always take only first generatedExpression
        // Other expressions are for int/float combinations
        return generatedExpressions[0];
    }
}
exports.Snippet = Snippet;
function escapeSpecialCharacters(source) {
    return (source
        // double up any backslashes because we're in a javascript string
        .replace(/\\/g, '\\\\')
        // escape any single quotes because that's our quote delimiter
        .replace(/'/g, "\\'"));
}
//# sourceMappingURL=snippet.js.map