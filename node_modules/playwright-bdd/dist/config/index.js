"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineBddConfig = exports.defineBddProject = void 0;
/**
 * BDD Config.
 */
const node_path_1 = __importDefault(require("node:path"));
const env_1 = require("./env");
const configDir_1 = require("./configDir");
const defaults_1 = require("./defaults");
function defineBddProject(config) {
    const { name, ...bddConfig } = config;
    if (name && !bddConfig.outputDir) {
        bddConfig.outputDir = node_path_1.default.join(defaults_1.defaults.outputDir, name);
    }
    const testDir = defineBddConfig(bddConfig);
    return { name, testDir };
}
exports.defineBddProject = defineBddProject;
function defineBddConfig(inputConfig) {
    const isMainProcess = !process.env.TEST_WORKER_INDEX;
    const configDir = (0, configDir_1.getPlaywrightConfigDir)({ resolveAndSave: isMainProcess });
    const config = getConfig(configDir, inputConfig);
    // In main process store config in env to be accessible by workers
    if (isMainProcess) {
        (0, env_1.saveConfigToEnv)(config);
    }
    return config.outputDir;
}
exports.defineBddConfig = defineBddConfig;
// eslint-disable-next-line visual/complexity
function getConfig(configDir, inputConfig) {
    const config = Object.assign({}, defaults_1.defaults, inputConfig);
    const features = config.features || config.paths;
    if (!features)
        throw new Error(`Please provide 'features' option in defineBddConfig()`);
    // Currently steps can be empty: e.g. when decorator steps loaded via importTestFrom
    // After removing importTestFrom we should throw error for missing steps as well.
    const steps = config.steps || config.require || config.import || [];
    const featuresRoot = config.featuresRoot
        ? node_path_1.default.resolve(configDir, config.featuresRoot)
        : configDir;
    return {
        ...config,
        features,
        steps,
        // important to resolve outputDir as it is used as unique key for input configs
        outputDir: node_path_1.default.resolve(configDir, config.outputDir),
        importTestFrom: resolveImportTestFrom(configDir, config.importTestFrom),
        featuresRoot,
    };
}
function resolveImportTestFrom(configDir, importTestFrom) {
    if (importTestFrom) {
        const { file, varName } = typeof importTestFrom === 'string'
            ? { file: importTestFrom }
            : importTestFrom;
        return {
            file: node_path_1.default.resolve(configDir, file),
            varName,
        };
    }
}
//# sourceMappingURL=index.js.map