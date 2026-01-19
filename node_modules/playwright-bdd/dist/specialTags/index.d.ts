/**
 * Special tags.
 */
import { DescribeConfigureOptions } from '../playwright/types';
export declare class SpecialTags {
    private ownTags;
    private tags;
    only?: boolean;
    skip?: boolean;
    fixme?: boolean;
    fail?: boolean;
    slow?: boolean;
    retries?: number;
    timeout?: number;
    mode?: DescribeConfigureOptions['mode'];
    constructor(ownTags?: string[], tags?: string[]);
    private extractFlags;
    private extractRetries;
    private extractTimeout;
    private extractMode;
}
//# sourceMappingURL=index.d.ts.map