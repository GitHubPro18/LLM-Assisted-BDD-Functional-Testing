"use strict";
/**
 * Helper to format Playwright test file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
const jsStringWrap_1 = require("../utils/jsStringWrap");
const utils_1 = require("../playwright/utils");
const paths_1 = require("../utils/paths");
const supportsTags = utils_1.playwrightVersion >= '1.42.0';
class Formatter {
    constructor(config) {
        this.config = config;
    }
    fileHeader(featureUri, importTestFrom) {
        // always use "/" for imports, see #91
        const importTestFromFile = (0, paths_1.toPosixPath)(importTestFrom?.file || 'playwright-bdd');
        let varName = importTestFrom?.varName || 'test';
        if (varName !== 'test')
            varName = `${varName} as test`;
        return [
            `/** Generated from: ${featureUri} */`, // prettier-ignore
            // this.quoted() is not possible for 'import from' as backticks not parsed
            `import { ${varName} } from ${JSON.stringify(importTestFromFile)};`,
            '',
        ];
    }
    describe(node, children) {
        const firstLine = `test.${this.getFunction('describe', node)}(${this.quoted(node.title)}, () => {`;
        if (!children.length)
            return [`${firstLine}});`, ''];
        return [
            firstLine, // prettier-ignore
            ...this.describeConfigure(node).map(indent),
            ...this.markAsFailing(node).map(indent),
            // we dont render test.slow() here, b/c each test.slow() call multilies timeout
            // that is not now tags are assumed to work
            '',
            ...children.map(indent),
            `});`,
            '',
        ];
    }
    beforeEach(fixtures, children) {
        const fixturesStr = [...fixtures].join(', ');
        // prettier-ignore
        return [
            `test.beforeEach(async ({ ${fixturesStr} }) => {`,
            ...children.map(indent),
            `});`,
            '',
        ];
    }
    test(node, fixtures, children) {
        const fixturesStr = [...fixtures].join(', ');
        const title = this.quoted(node.title);
        const tags = this.testTags(node);
        const firstLine = `${this.getFunction('test', node)}(${title}, ${tags}async ({ ${fixturesStr} }) => {`;
        if (!children.length)
            return [`${firstLine}});`, ''];
        const lines = [
            firstLine, // prettier-ignore
            // We use test.fail() in the test body instead of test.fail('...', () => { ... })
            // It allows to apply .only() / .skip() on failing tests.
            // See: https://github.com/microsoft/playwright/issues/30662
            ...this.markAsFailing(node).map(indent),
            ...children.map(indent),
            `});`,
            '',
        ];
        // Wrap test into anonymous describe in case of retries
        // See: https://github.com/microsoft/playwright/issues/10825
        return node.specialTags.retries !== undefined
            ? this.wrapInAnonymousDescribe([
                ...this.describeConfigure(node).map(indent),
                '',
                ...lines.map(indent),
            ])
            : lines;
    }
    // eslint-disable-next-line max-params
    step(keyword, text, argument, fixtureNames = []) {
        const fixtures = fixtureNames.length ? `{ ${fixtureNames.join(', ')} }` : '';
        const argumentArg = argument ? JSON.stringify(argument) : fixtures ? 'null' : '';
        const textArg = this.quoted(text);
        const args = [textArg, argumentArg, fixtures].filter((arg) => arg !== '').join(', ');
        return `await ${keyword}(${args});`;
    }
    missingStep(keyword, text) {
        return `// missing step: ${keyword}(${this.quoted(text)});`;
    }
    technicalSection(bddFileMetaBuilder, featureUri, fixtures) {
        return [
            '// == technical section ==', // prettier-ignore
            '',
            'test.use({',
            ...[
                '$test: ({}, use) => use(test),',
                `$uri: ({}, use) => use(${this.quoted(featureUri)}),`,
                '$bddFileMeta: ({}, use) => use(bddFileMeta),',
                ...fixtures,
            ].map(indent),
            '});',
            '',
            'const bddFileMeta = {',
            ...bddFileMetaBuilder.getObjectLines().map(indent),
            '};',
        ];
    }
    scenarioHookFixtures(fixtureNames) {
        if (!fixtureNames.length)
            return [];
        const fixtures = fixtureNames.join(', ');
        return [`$scenarioHookFixtures: ({ ${fixtures} }, use) => use({ ${fixtures} }),`];
    }
    workerHookFixtures(fixtureNames) {
        if (!fixtureNames.length)
            return [];
        const fixtures = fixtureNames.join(', ');
        const scope = this.quoted('worker');
        return [
            `$workerHookFixtures: [({ ${fixtures} }, use) => use({ ${fixtures} }), { scope: ${scope} }],`,
        ];
    }
    setWorldFixture(worldFixtureName) {
        return [`$world: ({ ${worldFixtureName} }, use) => use(${worldFixtureName}),`];
    }
    langFixture(lang) {
        return [`$lang: ({}, use) => use(${this.quoted(lang)}),`];
    }
    getFunction(baseFn, node) {
        if (node.specialTags.only)
            return `${baseFn}.only`;
        if (node.specialTags.skip)
            return `${baseFn}.skip`;
        if (node.specialTags.fixme)
            return `${baseFn}.fixme`;
        return baseFn;
    }
    describeConfigure(node) {
        const options = {};
        const { retries, timeout, mode } = node.specialTags;
        if (retries !== undefined)
            options.retries = retries;
        if (timeout !== undefined)
            options.timeout = timeout;
        if (mode !== undefined)
            options.mode = mode;
        return Object.keys(options).length
            ? [`test.describe.configure(${JSON.stringify(options)});`]
            : [];
    }
    wrapInAnonymousDescribe(lines) {
        return [
            'test.describe(() => {', // prettier-ignore
            ...lines,
            `});`,
            '',
        ];
    }
    markAsFailing(node) {
        return node.specialTags.fail ? [`test.fail();`] : [];
    }
    testTags(node) {
        return supportsTags && node.tags.length
            ? `{ tag: [${node.tags.map((tag) => this.quoted(tag)).join(', ')}] }, `
            : '';
    }
    /**
     * Apply this function only to string literals (mostly titles here).
     * Objects and arrays are handled with JSON.strinigfy,
     * b/c object keys can't be in backticks.
     * See: https://stackoverflow.com/questions/33194138/template-string-as-object-property-name
     */
    quoted(str) {
        return (0, jsStringWrap_1.jsStringWrap)(str, { quotes: this.config.quotes });
    }
}
exports.Formatter = Formatter;
function indent(value) {
    return value ? `${'  '}${value}` : value;
}
//# sourceMappingURL=formatter.js.map