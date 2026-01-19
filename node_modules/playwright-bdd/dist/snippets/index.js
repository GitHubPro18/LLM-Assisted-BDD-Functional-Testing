"use strict";
/**
 * Generate and show snippets for missing steps.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snippets = void 0;
const logger_1 = require("../utils/logger");
const stepConfig_1 = require("../steps/stepConfig");
const registry_1 = require("../steps/registry");
const snippet_1 = require("./snippet");
// if there are too many snippets, it's more like invalid configuration
const MAX_SNIPPETS_TO_SHOW = 10;
class Snippets {
    constructor(files) {
        this.files = files;
        this.snippets = new Map();
        this.snippetOptions = this.buildSnippetOptions();
        this.buildSnippets();
    }
    hasUndefinedSteps() {
        return this.snippets.size > 0;
    }
    print() {
        const snippetsToShow = [...this.snippets.values()].slice(0, MAX_SNIPPETS_TO_SHOW);
        const moreSnippetsCount = this.snippets.size - snippetsToShow.length;
        logger_1.logger.error([
            `Some steps are without definition!`,
            ...snippetsToShow,
            moreSnippetsCount > 0 ? `...and ${moreSnippetsCount} more.` : '',
            `Missing step definitions: ${this.snippets.size}.\nUse snippets above to create them.`,
        ]
            .filter(Boolean)
            .join('\n\n'));
    }
    buildSnippetOptions() {
        return {
            isPlaywrightStyle: !this.hasCucumberStyleSteps(),
            isTypeScript: this.hasTypeScriptSteps(),
            isDecorator: this.hasDecoratorSteps(),
        };
    }
    buildSnippets() {
        this.files.forEach((file) => {
            file.undefinedSteps.forEach((undefinedStep) => {
                this.buildSnippet(file, undefinedStep);
            });
        });
    }
    buildSnippet(file, undefinedStep) {
        const snippet = new snippet_1.Snippet(undefinedStep, this.snippetOptions);
        // use snippet code as unique key
        if (this.snippets.has(snippet.code))
            return;
        const { line, column } = undefinedStep.step.location;
        const snippetWithLocation = [
            `// ${this.snippets.size + 1}. Missing step definition for "${file.featureUri}:${line}:${column}"`,
            snippet.code,
        ].join('\n');
        this.snippets.set(snippet.code, snippetWithLocation);
    }
    hasTypeScriptSteps() {
        return registry_1.stepDefinitions.some((s) => s.uri.endsWith('.ts'));
    }
    hasDecoratorSteps() {
        const decoratorSteps = registry_1.stepDefinitions.filter((step) => (0, stepConfig_1.isDecorator)(step.stepConfig));
        return decoratorSteps.length > registry_1.stepDefinitions.length / 2;
    }
    hasCucumberStyleSteps() {
        const cucumberStyleSteps = registry_1.stepDefinitions.filter((step) => (0, stepConfig_1.isCucumberStyleStep)(step.stepConfig));
        return cucumberStyleSteps.length > registry_1.stepDefinitions.length / 2;
    }
}
exports.Snippets = Snippets;
//# sourceMappingURL=index.js.map