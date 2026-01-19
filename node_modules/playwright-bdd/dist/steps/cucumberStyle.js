"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cucumberStepCtor = void 0;
const getLocationInFile_1 = require("../playwright/getLocationInFile");
const registry_1 = require("./registry");
function cucumberStepCtor(keyword, customTest, worldFixture) {
    return (pattern, fn) => {
        const stepConfig = {
            keyword,
            pattern,
            fn,
            location: (0, getLocationInFile_1.getLocationByOffset)(3),
            customTest,
            worldFixture,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stepConfig.fn = ({ $bddContext }, ...args) => {
            return fn.call($bddContext.world, ...args);
        };
        (0, registry_1.registerStepDefinition)(stepConfig);
        // returns function to be able to call this step from other steps
        // see: https://github.com/vitalets/playwright-bdd/issues/110
        // Note: for new cucumber style we should call this fn with current world (add to docs)
        return fn;
    };
}
exports.cucumberStepCtor = cucumberStepCtor;
//# sourceMappingURL=cucumberStyle.js.map