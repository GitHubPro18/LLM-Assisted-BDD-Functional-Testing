import { UndefinedStep } from '../gen/testFile';
export type SnippetOptions = {
    isTypeScript: boolean;
    isPlaywrightStyle: boolean;
    isDecorator: boolean;
};
export declare class Snippet {
    private stepInfo;
    private options;
    private generatedExpression;
    code: string;
    constructor(stepInfo: UndefinedStep, options: SnippetOptions);
    private get pickleStep();
    private buildCode;
    private buildDecoratorCode;
    private getStepType;
    private getPattern;
    private getStepFunction;
    private getStepFunctionArguments;
    private getPatternArguments;
    private getLastArgument;
    private generateExpression;
}
//# sourceMappingURL=snippet.d.ts.map