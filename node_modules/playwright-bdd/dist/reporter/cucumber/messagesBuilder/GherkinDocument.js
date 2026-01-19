"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GherkinDocumentMessage = void 0;
const index_js_1 = require("../../../utils/index.js");
const Projects_1 = require("./Projects");
const gherkinDocumentMetaSymbol = Symbol('gherkinDocumentMeta');
class GherkinDocumentMessage {
    static extractMeta(gherkinDocument) {
        return gherkinDocument[gherkinDocumentMetaSymbol];
    }
    constructor(projectInfo, gherkinDocument) {
        this.projectInfo = projectInfo;
        this.gherkinDocument = gherkinDocument;
    }
    build() {
        const gherkinDocument = this.copyDocumentWithoutPickles();
        this.setUriWithProject(gherkinDocument);
        this.setMeta(gherkinDocument);
        return { gherkinDocument };
    }
    copyDocumentWithoutPickles() {
        return (0, index_js_1.omit)(this.gherkinDocument, 'pickles');
    }
    setUriWithProject(gherkinDocument) {
        gherkinDocument.uri = (0, Projects_1.getFeatureUriWithProject)(this.projectInfo, this.gherkinDocument.uri);
    }
    setMeta(gherkinDocument) {
        gherkinDocument[gherkinDocumentMetaSymbol] = {
            originalUri: this.gherkinDocument.uri || '',
            projectName: this.projectInfo?.projectName,
            browserName: this.projectInfo?.browserName,
        };
    }
}
exports.GherkinDocumentMessage = GherkinDocumentMessage;
//# sourceMappingURL=GherkinDocument.js.map