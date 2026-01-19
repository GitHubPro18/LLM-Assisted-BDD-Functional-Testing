import * as messages from '@cucumber/messages';
import { CucumberHtmlStream } from '@cucumber/html-formatter';
import BaseReporter, { InternalOptions } from './base';
import { AttachmentEnvelope } from './messagesBuilder/types';
import { SkipAttachments } from './attachments/skip';
type HtmlReporterOptions = {
    outputFile?: string;
    skipAttachments?: SkipAttachments;
    externalAttachments?: boolean;
    attachmentsBaseURL?: string;
};
export default class HtmlReporter extends BaseReporter {
    protected userOptions: HtmlReporterOptions;
    protected htmlStream: CucumberHtmlStream;
    protected attachmentsDir: string;
    protected attachmentsBaseURL: string;
    protected hasTraces: boolean;
    constructor(internalOptions: InternalOptions, userOptions?: HtmlReporterOptions);
    finished(): Promise<void>;
    protected handleAttachment(envelope: AttachmentEnvelope): void;
    protected writeEnvelope(envelope: messages.Envelope): void;
    /**
     * If there is trace attachment, copy trace-viewer to the report
     * and create additional attachment with trace view link.
     * - implementation in PW: https://github.com/microsoft/playwright/blob/412073253f03099d0fe4081b26ad5f0494fea8d2/packages/playwright/src/reporters/html.ts#L414
     * - attachmentsBaseURL should start with http(s) to be able to show traces.
     */
    protected handleTraceAttachment(attachment: messages.Attachment): void;
    protected setupAttachmentsDir(): void;
    protected setupAttachmentsBaseURL(): void;
}
export {};
//# sourceMappingURL=html.d.ts.map