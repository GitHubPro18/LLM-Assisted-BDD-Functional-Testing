"use strict";
/**
 * Guess import test from by used steps.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTestFromGuesser = void 0;
const testTypeImpl_1 = require("../playwright/testTypeImpl");
const exportedTest_1 = require("../steps/exportedTest");
const exit_1 = require("../utils/exit");
class ImportTestFromGuesser {
    constructor(featureUri, usedStepDefinitions, usedDecoratorFixtures) {
        this.featureUri = featureUri;
        this.usedStepDefinitions = usedStepDefinitions;
        this.usedDecoratorFixtures = usedDecoratorFixtures;
        this.customTestsSet = new Set();
    }
    guess() {
        this.fillCustomTestsFromRegularSteps();
        this.fillCustomTestsFromDecoratorSteps();
        if (!this.getUsedCustomTestsCount())
            return;
        if (!(0, exportedTest_1.getExportedTestsCount)())
            this.throwCantGuessError();
        const topmostTest = this.findTopmostTest();
        const { file, varName } = this.getExportedTestInfo(topmostTest);
        return { file, varName };
    }
    fillCustomTestsFromRegularSteps() {
        this.usedStepDefinitions.forEach(({ stepConfig }) => {
            if (stepConfig.customTest)
                this.customTestsSet.add(stepConfig.customTest);
        });
    }
    fillCustomTestsFromDecoratorSteps() {
        this.usedDecoratorFixtures.forEach((fixtureName) => {
            const exportedTest = (0, exportedTest_1.findExportedTestWithFixture)(fixtureName);
            if (!exportedTest) {
                (0, exit_1.exit)(`Can't guess test instance for decorator fixture "${fixtureName}".`, `Please add fixture files to BDD configuration "steps" or set "importTestFrom" manually.`);
            }
            this.customTestsSet.add(exportedTest.testInstance);
        });
    }
    getUsedCustomTestsCount() {
        return this.customTestsSet.size;
    }
    findTopmostTest() {
        const customTests = [...this.customTestsSet];
        let topmostTest = customTests[0];
        for (let i = 1; i < customTests.length; i++) {
            const higherTest = selectHigherTestInstance(topmostTest, customTests[i]);
            if (!higherTest) {
                (0, exit_1.exit)(`Can't guess test instance for: ${this.featureUri}.`, `Found ${customTests.length} test instances, but they should extending each other.`, `Please check BDD configuration "steps" or set "importTestFrom" manually.`);
            }
            topmostTest = higherTest;
        }
        return topmostTest;
    }
    getExportedTestInfo(customTest) {
        const info = (0, exportedTest_1.getExportedTestInfo)(customTest);
        if (!info)
            this.throwCantGuessError();
        return info;
    }
    throwCantGuessError() {
        (0, exit_1.exit)(`Can't guess test instance for: ${this.featureUri}.`, `Your tests use custom test instance, produced by base.extend().`, `Please check that:\n`, `- fixtures file exports "test" variable\n`, `- fixtures file is included in BDD configuration "steps" option\n`, `If it does not help, try to set "importTestFrom" option manually.`);
    }
}
exports.ImportTestFromGuesser = ImportTestFromGuesser;
function selectHigherTestInstance(test1, test2) {
    if ((0, testTypeImpl_1.isTestContainsSubtest)(test1, test2))
        return test1;
    if ((0, testTypeImpl_1.isTestContainsSubtest)(test2, test1))
        return test2;
    // Provided tests are no in parent-child relation
}
//# sourceMappingURL=importTestFrom.js.map