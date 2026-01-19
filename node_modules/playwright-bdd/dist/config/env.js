"use strict";
/**
 * Storing configs in env var PLAYWRIGHT_BDD_CONFIGS as JSON-stringified values.
 * For passing configs to playwright workers and bddgen.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBddConfig = exports.getEnvConfigs = exports.getConfigFromEnv = exports.saveConfigToEnv = void 0;
/*
Example of PLAYWRIGHT_BDD_CONFIGS:
{
  '/Users/foo/bar/.features-gen/one': {
    outputDir: '/Users/foo/bar/.features-gen/one',
    paths: [ 'features-one/*.feature' ],
    ...
  },
  '/Users/foo/bar/.features-gen/two': {
    outputDir: '/Users/foo/bar/.features-gen/two',
    paths: [ 'features-two/*.feature' ],
    ...
  },
}
*/
const utils_1 = require("../utils");
const exit_1 = require("../utils/exit");
let envConfigsCache;
function saveConfigToEnv(config) {
    const envConfigs = getEnvConfigs();
    const configKey = getConfigKey(config.outputDir);
    const existingConfig = envConfigs[configKey];
    if (existingConfig) {
        // Playwright config can be evaluated several times.
        // Throw error only if different calls of defineBddConfig() use the same outputDir.
        // See: https://github.com/vitalets/playwright-bdd/issues/39#issuecomment-1653805368
        if (!isSameConfigs(config, existingConfig)) {
            (0, exit_1.exit)(`When using several calls of defineBddConfig()`, `please manually provide different "outputDir" option for each project,`, `or use defineBddProject() helper.`);
        }
        return;
    }
    envConfigs[configKey] = config;
    saveEnvConfigs(envConfigs);
}
exports.saveConfigToEnv = saveConfigToEnv;
function getConfigFromEnv(testDir, { throws = true } = {}) {
    const configKey = getConfigKey(testDir);
    const envConfigs = getEnvConfigs();
    const config = envConfigs[configKey];
    if (!config && throws) {
        (0, exit_1.exit)(`BDD config not found for testDir: "${configKey}".`, `Available testDirs:\n${Object.keys(envConfigs).join('\n')}`);
    }
    return config;
}
exports.getConfigFromEnv = getConfigFromEnv;
function getEnvConfigs() {
    if (!envConfigsCache) {
        envConfigsCache = JSON.parse(process.env.PLAYWRIGHT_BDD_CONFIGS || '{}');
    }
    return envConfigsCache;
}
exports.getEnvConfigs = getEnvConfigs;
function hasBddConfig(testDir) {
    return Boolean(testDir && getConfigFromEnv(testDir, { throws: false }));
}
exports.hasBddConfig = hasBddConfig;
function getConfigKey(testDir) {
    return (0, utils_1.trimTrailingSlash)(testDir);
}
function saveEnvConfigs(envConfigs) {
    envConfigsCache = envConfigs;
    process.env.PLAYWRIGHT_BDD_CONFIGS = JSON.stringify(envConfigs);
}
function isSameConfigs(config1, config2) {
    return JSON.stringify(config1) === JSON.stringify(config2);
}
//# sourceMappingURL=env.js.map