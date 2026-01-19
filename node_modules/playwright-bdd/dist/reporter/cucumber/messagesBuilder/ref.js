"use strict";
/**
 * Returns reference to a messagesBuilder singleton instance.
 * We pass onTestEnd and onEnd calls only for the first reference (reporter),
 * otherwise all events will be duplicated.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesBuilderRef = void 0;
const _1 = require(".");
let instance;
let referenceCount = 0;
function getMessagesBuilderRef() {
    if (!instance)
        instance = new _1.MessagesBuilder();
    const isFirstRef = ++referenceCount === 1;
    return {
        builder: instance,
        onBegin(config) {
            if (isFirstRef)
                this.builder.onBegin(config);
        },
        onTestEnd(test, result) {
            if (isFirstRef)
                this.builder.onTestEnd(test, result);
        },
        onEnd(fullResult) {
            if (isFirstRef)
                this.builder.onEnd(fullResult);
        },
    };
}
exports.getMessagesBuilderRef = getMessagesBuilderRef;
//# sourceMappingURL=ref.js.map