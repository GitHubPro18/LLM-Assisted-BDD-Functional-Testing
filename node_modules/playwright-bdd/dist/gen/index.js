"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFilesGenerator = void 0;
/**
 * Generate playwright test files from Gherkin documents.
 */
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const testFile_1 = require("./testFile");
const load_1 = require("../features/load");
const snippets_1 = require("../snippets");
const configDir_1 = require("../config/configDir");
const logger_1 = require("../utils/logger");
const tag_expressions_1 = __importDefault(require("@cucumber/tag-expressions"));
const exit_1 = require("../utils/exit");
const load_2 = require("../steps/load");
const paths_1 = require("../utils/paths");
const registry_1 = require("../steps/registry");
class TestFilesGenerator {
    constructor(config) {
        this.config = config;
        this.featuresLoader = new load_1.FeaturesLoader();
        this.files = [];
        this.logger = new logger_1.Logger({ verbose: config.verbose });
        if (config.tags)
            this.tagsExpression = (0, tag_expressions_1.default)(config.tags);
    }
    async generate() {
        await (0, exit_1.withExitHandler)(async () => {
            await Promise.all([this.loadFeatures(), this.loadSteps()]);
            this.buildFiles();
            this.checkUndefinedSteps();
            await this.clearOutputDir();
            await this.saveFiles();
        });
    }
    async extractSteps() {
        await this.loadSteps();
        return registry_1.stepDefinitions;
    }
    // todo: combine with extractSteps
    async extractUnusedSteps() {
        await Promise.all([this.loadFeatures(), this.loadSteps()]);
        this.buildFiles();
        return registry_1.stepDefinitions.filter((stepDefinition) => {
            const isUsed = this.files.some((file) => file.usedStepDefinitions.has(stepDefinition));
            return !isUsed;
        });
    }
    async loadFeatures() {
        const cwd = (0, configDir_1.getPlaywrightConfigDir)();
        const featureFiles = await (0, load_1.resolveFeatureFiles)(cwd, this.config.features);
        this.logger.log(`Loading features: ${this.config.features}`);
        this.logger.log(`Resolved feature files: ${featureFiles.length}`);
        featureFiles.forEach((featureFile) => this.logger.log(`  ${(0, paths_1.relativeToCwd)(featureFile)}`));
        await this.featuresLoader.load(featureFiles, {
            relativeTo: cwd,
            defaultDialect: this.config.language,
        });
        this.handleFeatureParseErrors();
    }
    async loadSteps() {
        const cwd = (0, configDir_1.getPlaywrightConfigDir)();
        this.logger.log(`Loading steps: ${this.config.steps}`);
        const stepFiles = await (0, load_2.resolveStepFiles)(cwd, this.config.steps);
        this.logger.log(`Resolved step files: ${stepFiles.length}`);
        stepFiles.forEach((stepFiles) => this.logger.log(`  ${(0, paths_1.relativeToCwd)(stepFiles)}`));
        await (0, load_2.loadSteps)(stepFiles);
        this.logger.log(`Loaded steps: ${registry_1.stepDefinitions.length}`);
        await this.handleImportTestFrom();
    }
    buildFiles() {
        this.files = this.featuresLoader
            .getDocumentsWithPickles()
            .map((gherkinDocument) => {
            return new testFile_1.TestFile({
                gherkinDocument,
                // doc.uri is always relative to cwd (coming after cucumber handling)
                // see: https://github.com/cucumber/cucumber-js/blob/main/src/api/gherkin.ts#L51
                outputPath: this.getSpecPathByFeaturePath(gherkinDocument.uri),
                config: this.config,
                tagsExpression: this.tagsExpression,
            }).build();
        })
            .filter((file) => file.testCount > 0);
    }
    getSpecPathByFeaturePath(relFeaturePath) {
        const configDir = (0, configDir_1.getPlaywrightConfigDir)();
        const absFeaturePath = node_path_1.default.resolve(configDir, relFeaturePath);
        const relOutputPath = node_path_1.default.relative(this.config.featuresRoot, absFeaturePath);
        if (relOutputPath.startsWith('..')) {
            (0, exit_1.exit)(`All feature files should be located underneath featuresRoot.`, `Please change featuresRoot or paths in configuration.\n`, `featureFile: ${absFeaturePath}\n`, `featuresRoot: ${this.config.featuresRoot}\n`);
        }
        const absOutputPath = node_path_1.default.resolve(this.config.outputDir, relOutputPath);
        return `${absOutputPath}.spec.js`;
    }
    checkUndefinedSteps() {
        const snippets = new snippets_1.Snippets(this.files);
        if (snippets.hasUndefinedSteps()) {
            snippets.print();
            (0, exit_1.exit)();
        }
    }
    async handleImportTestFrom() {
        const { importTestFrom } = this.config;
        if (!importTestFrom)
            return;
        // require importTestFrom separately instead of just adding to steps,
        // b/c we need additionally check that it exports "test" variable.
        // If checking by together loaded files, it's become messy to find correct file by url,
        // b/c of win/posix path separator.
        const exportedTests = await (0, load_2.loadStepsFromFile)(importTestFrom.file);
        const varName = importTestFrom.varName || 'test';
        if (!exportedTests.find((info) => info.varName === varName)) {
            (0, exit_1.exit)(`File "${(0, paths_1.relativeToCwd)(importTestFrom.file)}" pointed by "importTestFrom"`, `should export "${varName}" variable.`);
        }
    }
    async saveFiles() {
        this.logger.log(`Generating Playwright tests: ${this.files.length}`);
        this.files.forEach((file) => {
            file.save();
            this.logger.log(`  ${(0, paths_1.relativeToCwd)(file.outputPath)}`);
        });
    }
    async clearOutputDir() {
        const pattern = `${fast_glob_1.default.convertPathToPattern(this.config.outputDir)}/**/*.spec.js`;
        const testFiles = await (0, fast_glob_1.default)(pattern);
        this.logger.log(`Clearing output dir: ${(0, paths_1.relativeToCwd)(pattern)}`);
        const tasks = testFiles.map((testFile) => node_fs_1.default.promises.rm(testFile));
        await Promise.all(tasks);
    }
    handleFeatureParseErrors() {
        const { parseErrors } = this.featuresLoader;
        if (parseErrors.length) {
            const message = parseErrors
                .map((parseError) => {
                return `Parse error in "${parseError.source.uri}" ${parseError.message}`;
            })
                .join('\n');
            (0, exit_1.exit)(message);
        }
    }
}
exports.TestFilesGenerator = TestFilesGenerator;
//# sourceMappingURL=index.js.map