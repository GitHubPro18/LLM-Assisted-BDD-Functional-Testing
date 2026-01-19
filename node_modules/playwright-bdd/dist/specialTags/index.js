"use strict";
/**
 * Special tags.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialTags = void 0;
class SpecialTags {
    constructor(ownTags = [], tags = []) {
        this.ownTags = ownTags;
        this.tags = tags;
        this.extractFlags();
        this.extractRetries();
        this.extractTimeout();
        this.extractMode();
    }
    extractFlags() {
        // for slow we use this.tags (not this.ownTags),
        // b/c each test.slow() call multiplies timeout
        // that is not now tags are assumed to work
        if (this.tags.includes(`@slow`))
            this.slow = true;
        if (this.ownTags.includes(`@fail`))
            this.fail = true;
        // order is important
        const executionFlags = ['only', 'skip', 'fixme'];
        for (const flag of executionFlags) {
            if (this.ownTags.includes(`@${flag}`)) {
                this[flag] = true;
                return;
            }
        }
    }
    extractRetries() {
        for (const tag of this.ownTags.reverse()) {
            const match = tag.match(/@retries:(\d+)/i);
            if (match) {
                this.retries = Number(match[1]);
                return;
            }
        }
    }
    extractTimeout() {
        for (const tag of this.ownTags.reverse()) {
            const match = tag.match(/@timeout:([\d_]+)/i);
            if (match) {
                this.timeout = Number(match[1].replace(/_/g, ''));
                return;
            }
        }
    }
    extractMode() {
        for (const tag of this.ownTags.reverse()) {
            const match = tag.match(/@mode:(default|parallel|serial)/i);
            if (match) {
                this.mode = match[1];
                return;
            }
        }
    }
}
exports.SpecialTags = SpecialTags;
//# sourceMappingURL=index.js.map