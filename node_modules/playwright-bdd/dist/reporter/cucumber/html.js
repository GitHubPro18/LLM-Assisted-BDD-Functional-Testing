"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Cucumber html reporter.
 * Based on: https://github.com/cucumber/cucumber-js/blob/main/src/formatter/html_formatter.ts
 * See: https://github.com/cucumber/html-formatter
 * See: https://github.com/cucumber/react-components
 */
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = require("node:stream/promises");
const messages = __importStar(require("@cucumber/messages"));
const html_formatter_1 = require("@cucumber/html-formatter");
const utils_1 = require("../../utils");
const node_path_1 = __importDefault(require("node:path"));
const base_1 = __importDefault(require("./base"));
const helpers_1 = require("./attachments/helpers");
const skip_1 = require("./attachments/skip");
const external_1 = require("./attachments/external");
const trace_1 = require("./attachments/trace");
// store attachments in subdirectory to not accidentally
// bloat working dir and make it easier to find report html file.
// 'data' name is also used in Playwright HTML reporter.
const ATTACHMENTS_DIR = 'data';
class HtmlReporter extends base_1.default {
    constructor(internalOptions, userOptions = {}) {
        super(internalOptions);
        this.userOptions = userOptions;
        this.attachmentsDir = '';
        this.attachmentsBaseURL = '';
        this.hasTraces = false;
        this.setOutputStream(this.userOptions.outputFile);
        const packageRoot = (0, utils_1.resolvePackageRoot)('@cucumber/html-formatter');
        this.htmlStream = new html_formatter_1.CucumberHtmlStream(node_path_1.default.join(packageRoot, 'dist/main.css'), node_path_1.default.join(packageRoot, 'dist/main.js'));
        if (this.userOptions.externalAttachments) {
            this.setupAttachmentsDir();
            this.setupAttachmentsBaseURL();
        }
        this.eventBroadcaster.on('envelope', (envelope) => {
            if ((0, helpers_1.isAttachmentEnvelope)(envelope)) {
                this.handleAttachment(envelope);
            }
            else {
                this.writeEnvelope(envelope);
            }
        });
        this.htmlStream.pipe(this.outputStream);
    }
    async finished() {
        this.htmlStream.end();
        await (0, promises_1.finished)(this.htmlStream);
        if (this.hasTraces)
            await (0, trace_1.copyTraceViewer)(this.outputDir);
        await super.finished();
    }
    handleAttachment(envelope) {
        if ((0, skip_1.shouldSkipAttachment)(envelope, this.userOptions.skipAttachments))
            return;
        // For now don't externalize text attachments, b/c they are not visible in the report.
        // In the future maybe handle separately 'text/x.cucumber.log+plain', 'text/uri-list'.
        // See: https://github.com/cucumber/cucumber-js/issues/2430
        // See: https://github.com/cucumber/react-components/blob/main/src/components/gherkin/attachment/Attachment.tsx#L32
        const useExternalAttachment = this.userOptions.externalAttachments && !(0, external_1.isTextAttachment)(envelope.attachment);
        const newAttachment = useExternalAttachment
            ? (0, external_1.toExternalAttachment)(envelope.attachment, this.attachmentsDir, this.attachmentsBaseURL)
            : (0, external_1.toEmbeddedAttachment)(envelope.attachment);
        if (useExternalAttachment)
            this.handleTraceAttachment(newAttachment);
        this.writeEnvelope({
            ...envelope,
            attachment: newAttachment,
        });
    }
    writeEnvelope(envelope) {
        this.htmlStream.write(envelope);
    }
    /**
     * If there is trace attachment, copy trace-viewer to the report
     * and create additional attachment with trace view link.
     * - implementation in PW: https://github.com/microsoft/playwright/blob/412073253f03099d0fe4081b26ad5f0494fea8d2/packages/playwright/src/reporters/html.ts#L414
     * - attachmentsBaseURL should start with http(s) to be able to show traces.
     */
    handleTraceAttachment(attachment) {
        if (this.attachmentsBaseURL.startsWith('http') && (0, trace_1.isTraceAttachment)(attachment)) {
            this.hasTraces = true;
            this.writeEnvelope({
                attachment: {
                    ...attachment,
                    contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
                    mediaType: 'text/uri-list',
                    body: (0, trace_1.generateTraceUrl)(attachment),
                    url: undefined,
                },
            });
        }
    }
    setupAttachmentsDir() {
        if (!this.outputDir) {
            throw new Error('Unable to externalize attachments when reporter is not writing to a file');
        }
        this.attachmentsDir = node_path_1.default.join(this.outputDir, ATTACHMENTS_DIR);
        if (node_fs_1.default.existsSync(this.attachmentsDir))
            node_fs_1.default.rmSync(this.attachmentsDir, { recursive: true });
        node_fs_1.default.mkdirSync(this.attachmentsDir, { recursive: true });
    }
    setupAttachmentsBaseURL() {
        this.attachmentsBaseURL = removeTrailingSlash(this.userOptions.attachmentsBaseURL || ATTACHMENTS_DIR);
    }
}
exports.default = HtmlReporter;
function removeTrailingSlash(url) {
    return url.replace(/\/+$/, '');
}
//# sourceMappingURL=html.js.map