import { BDDConfig } from '../config/types';
export declare class TestFilesGenerator {
    private config;
    private featuresLoader;
    private files;
    private tagsExpression?;
    private logger;
    constructor(config: BDDConfig);
    generate(): Promise<void>;
    extractSteps(): Promise<import("../steps/registry").StepDefinition[]>;
    extractUnusedSteps(): Promise<import("../steps/registry").StepDefinition[]>;
    private loadFeatures;
    private loadSteps;
    private buildFiles;
    private getSpecPathByFeaturePath;
    private checkUndefinedSteps;
    private handleImportTestFrom;
    private saveFiles;
    private clearOutputDir;
    private handleFeatureParseErrors;
}
//# sourceMappingURL=index.d.ts.map