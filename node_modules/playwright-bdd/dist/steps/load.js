"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveStepFiles = exports.loadStepsFromFile = exports.loadSteps = void 0;
/**
 * Load steps using Playwright's importOrRequire.
 */
const paths_1 = require("../utils/paths");
const utils_1 = require("../utils");
const requireOrImport_1 = require("../playwright/requireOrImport");
const exportedTest_1 = require("./exportedTest");
const DEFAULT_STEP_EXTENSIONS = '{js,mjs,cjs,ts,mts,cts}';
async function loadSteps(stepFiles) {
    for (const filePath of stepFiles) {
        await loadStepsFromFile(filePath);
    }
}
exports.loadSteps = loadSteps;
async function loadStepsFromFile(filePath) {
    const obj = await (0, requireOrImport_1.requireOrImport)(filePath);
    return (0, exportedTest_1.registerExportedTests)(filePath, obj);
}
exports.loadStepsFromFile = loadStepsFromFile;
async function resolveStepFiles(cwd, patterns) {
    return (0, paths_1.resolveFiles)(cwd, (0, utils_1.toArray)(patterns), DEFAULT_STEP_EXTENSIONS);
}
exports.resolveStepFiles = resolveStepFiles;
//# sourceMappingURL=load.js.map