/**
 * Generate and show snippets for missing steps.
 */
import { TestFile } from '../gen/testFile';
export declare class Snippets {
    private files;
    private snippets;
    private snippetOptions;
    constructor(files: TestFile[]);
    hasUndefinedSteps(): boolean;
    print(): void;
    private buildSnippetOptions;
    private buildSnippets;
    private buildSnippet;
    private hasTypeScriptSteps;
    private hasDecoratorSteps;
    private hasCucumberStyleSteps;
}
//# sourceMappingURL=index.d.ts.map