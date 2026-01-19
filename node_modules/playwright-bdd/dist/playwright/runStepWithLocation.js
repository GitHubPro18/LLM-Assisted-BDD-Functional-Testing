"use strict";
/**
 * Run Playwright step with custom location.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStepWithLocation = void 0;
const utils_1 = require("./utils");
// eslint-disable-next-line max-params
async function runStepWithLocation(test, stepText, location, body) {
    // Since PW 1.43 testInfo._runAsStep was replaced with a more complex logic.
    // To run step with a custom location, we hijack testInfo._addStep()
    // so that it appends location for the bdd step calls.
    // Finally we call test.step(), that internally invokes testInfo._addStep().
    // See: https://github.com/microsoft/playwright/issues/30160
    // See: https://github.com/microsoft/playwright/blob/release-1.43/packages/playwright/src/common/testType.ts#L262
    // See: https://github.com/microsoft/playwright/blob/release-1.43/packages/playwright/src/worker/testInfo.ts#L247
    if (utils_1.playwrightVersion >= '1.39.0') {
        const testInfo = test.info();
        // here we rely on that testInfo._addStep is called synchronously in test.step()
        const origAddStep = testInfo._addStep;
        testInfo._addStep = function (data) {
            data.location = location;
            testInfo._addStep = origAddStep;
            return origAddStep.call(this, data);
        };
        return test.step(stepText, body);
    }
    else {
        const testInfo = test.info();
        return testInfo._runAsStep({ category: 'test.step', title: stepText, location }, async () => {
            return await body();
        });
    }
}
exports.runStepWithLocation = runStepWithLocation;
//# sourceMappingURL=runStepWithLocation.js.map