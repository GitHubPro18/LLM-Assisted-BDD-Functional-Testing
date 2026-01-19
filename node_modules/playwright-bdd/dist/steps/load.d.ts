export declare function loadSteps(stepFiles: string[]): Promise<void>;
export declare function loadStepsFromFile(filePath: string): Promise<{
    testInstance: import("../playwright/types").TestTypeCommon;
    file: string;
    varName: string;
}[]>;
export declare function resolveStepFiles(cwd: string, patterns: string | string[]): Promise<string[]>;
//# sourceMappingURL=load.d.ts.map