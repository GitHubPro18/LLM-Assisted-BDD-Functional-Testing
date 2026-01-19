"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pickles = void 0;
const index_js_1 = require("../../../utils/index.js");
const Projects_1 = require("./Projects");
class Pickles {
    buildMessages(testCases) {
        const messages = [];
        testCases.forEach((testCase) => {
            messages.push(this.buildPickleMessage(testCase));
        });
        return messages;
    }
    buildPickleMessage(testCase) {
        const pickle = {
            ...(0, index_js_1.omit)(testCase.pickle, 'location'),
            uri: (0, Projects_1.getFeatureUriWithProject)(testCase.projectInfo, testCase.pickle.uri),
        };
        return { pickle };
    }
}
exports.Pickles = Pickles;
//# sourceMappingURL=Pickles.js.map