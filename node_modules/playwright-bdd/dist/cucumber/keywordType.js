"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStepKeywordType = exports.KeywordType = void 0;
/**
 * Based on: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/helpers/keyword_type.ts
 */
const gherkin_1 = require("@cucumber/gherkin");
const valueChecker_1 = require("./valueChecker");
var KeywordType;
(function (KeywordType) {
    KeywordType["Precondition"] = "precondition";
    KeywordType["Event"] = "event";
    KeywordType["Outcome"] = "outcome";
})(KeywordType || (exports.KeywordType = KeywordType = {}));
// eslint-disable-next-line visual/complexity
function getStepKeywordType({ keyword, language, previousKeywordType, }) {
    const dialect = gherkin_1.dialects[language];
    const stepKeywords = ['given', 'when', 'then', 'and', 'but'];
    const type = stepKeywords.find((key) => dialect[key].includes(keyword));
    switch (type) {
        case 'when':
            return KeywordType.Event;
        case 'then':
            return KeywordType.Outcome;
        case 'and':
        case 'but':
            if ((0, valueChecker_1.doesHaveValue)(previousKeywordType)) {
                return previousKeywordType;
            }
        // fallthrough
        default:
            return KeywordType.Precondition;
    }
}
exports.getStepKeywordType = getStepKeywordType;
//# sourceMappingURL=keywordType.js.map