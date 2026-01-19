"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceExitIfNeeded = void 0;
const esmLoader_1 = require("../playwright/esmLoader");
const utils_1 = require("../playwright/utils");
// In PW <= 1.43 esm loader keep messaging port open -> we need to close process manually
// Fixed in PW 1.44: https://github.com/microsoft/playwright/pull/30271
function forceExitIfNeeded() {
    if (esmLoader_1.esmLoaderInstalled && utils_1.playwrightVersion < '1.44.0') {
        setTimeout(() => process.exit(process.exitCode || 0), 0).unref();
    }
}
exports.forceExitIfNeeded = forceExitIfNeeded;
//# sourceMappingURL=helpers.js.map