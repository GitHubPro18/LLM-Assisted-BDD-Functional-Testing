"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findExportedTestWithFixture = exports.getExportedTestsCount = exports.getExportedTestInfo = exports.registerExportedTests = void 0;
const testTypeImpl_1 = require("../playwright/testTypeImpl");
const exportedTests = new Map();
function registerExportedTests(file, exportsObj) {
    const fileExportedTests = [];
    for (const [varName, testInstance] of Object.entries(exportsObj)) {
        if (!(0, testTypeImpl_1.isPlaywrightTestInstance)(testInstance))
            continue;
        const exportedTest = { testInstance, file, varName };
        fileExportedTests.push(exportedTest);
        if (!exportedTests.has(testInstance)) {
            exportedTests.set(testInstance, exportedTest);
        }
    }
    return fileExportedTests;
}
exports.registerExportedTests = registerExportedTests;
function getExportedTestInfo(customTest) {
    return exportedTests.get(customTest);
}
exports.getExportedTestInfo = getExportedTestInfo;
function getExportedTestsCount() {
    return exportedTests.size;
}
exports.getExportedTestsCount = getExportedTestsCount;
function findExportedTestWithFixture(fixtureName) {
    for (const [testInstance, exportedTest] of exportedTests.entries()) {
        if ((0, testTypeImpl_1.isTestContainsFixture)(testInstance, fixtureName)) {
            return exportedTest;
        }
    }
}
exports.findExportedTestWithFixture = findExportedTestWithFixture;
//# sourceMappingURL=exportedTest.js.map