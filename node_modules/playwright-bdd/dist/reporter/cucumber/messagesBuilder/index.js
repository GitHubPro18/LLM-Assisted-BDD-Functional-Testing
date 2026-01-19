"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesBuilder = void 0;
const TestCaseRun_1 = require("./TestCaseRun");
const TestCase_1 = require("./TestCase");
const Meta_1 = require("./Meta");
const timing_1 = require("./timing");
const node_events_1 = __importDefault(require("node:events"));
const EventDataCollector_js_1 = __importDefault(require("../../../cucumber/formatter/EventDataCollector.js"));
const AutofillMap_js_1 = require("../../../utils/AutofillMap.js");
const GherkinDocuments_1 = require("./GherkinDocuments");
const Pickles_1 = require("./Pickles");
const env_js_1 = require("../../../config/env.js");
class MessagesBuilder {
    constructor() {
        this.report = {
            meta: null,
            source: [],
            gherkinDocument: [],
            pickle: [],
            stepDefinition: [],
            hook: [],
            testRunStarted: null,
            testCase: [],
            testCaseRuns: [],
            testRunFinished: null,
        };
        this.testCaseRuns = [];
        this.testCases = new AutofillMap_js_1.AutofillMap();
        this.hooks = new AutofillMap_js_1.AutofillMap();
        this.gherkinDocuments = new GherkinDocuments_1.GherkinDocuments();
        this.onEndPromiseResolve = () => { };
        this.eventDataCollectorEmitter = new node_events_1.default();
        this.eventDataCollector = new EventDataCollector_js_1.default(this.eventDataCollectorEmitter);
        this.onEndPromise = new Promise((resolve) => (this.onEndPromiseResolve = resolve));
    }
    onBegin(config) {
        this.fullConfig = config;
    }
    onTestEnd(test, result) {
        // Skip tests of non-bdd projects
        const testDir = test.parent.project()?.testDir || this.fullConfig.rootDir;
        if (!(0, env_js_1.hasBddConfig)(testDir))
            return;
        // For skipped tests Playwright doesn't run fixtures
        // and we don't have bddData attachment -> don't know feature uri.
        // Don't add such test run to report.
        if (result.status === 'skipped')
            return;
        // Important to create TestCaseRun in this method (not later),
        // b/c test properties can change after retries
        // (especially annotations where we store bddData)
        const testCaseRun = new TestCaseRun_1.TestCaseRun(test, result, this.hooks);
        this.testCaseRuns.push(testCaseRun);
    }
    onEnd(fullResult) {
        this.fullResult = fullResult;
        this.onEndPromiseResolve();
    }
    /**
     * Builds Cucumber messages.
     * Note: wrapped into promise to build messages once for all reporters.
     */
    async buildMessages() {
        if (!this.buildMessagesPromise)
            this.buildMessagesPromise = this.doBuildMessages();
        return this.buildMessagesPromise;
    }
    async doBuildMessages() {
        await this.onEndPromise;
        // order here is important
        await this.loadFeatures();
        this.createTestCases();
        this.addMeta();
        this.addSourcesAndDocuments();
        this.addPickles();
        this.addHooks();
        this.addTestRunStarted();
        this.addTestCases();
        this.addTestCaseRuns();
        this.addTestRunFinished();
        this.buildEventDataCollector();
    }
    emitMessages(eventBroadcaster) {
        Object.values(this.report).forEach((value) => {
            if (!value)
                return;
            const messages = Array.isArray(value) ? value : [value];
            messages.forEach((message) => eventBroadcaster.emit('envelope', message));
        });
    }
    createTestCases() {
        this.testCaseRuns.forEach((testCaseRun) => {
            const testId = testCaseRun.test.id;
            const gherkinDocsForProject = this.gherkinDocuments.getDocumentsForProject(testCaseRun.projectInfo);
            const testCase = this.testCases.getOrCreate(testId, () => new TestCase_1.TestCase(testId, gherkinDocsForProject));
            testCase.addRun(testCaseRun);
            testCaseRun.testCase = testCase;
        });
    }
    async loadFeatures() {
        await this.gherkinDocuments.load(this.testCaseRuns);
    }
    addMeta() {
        this.report.meta = new Meta_1.Meta().buildMessage();
    }
    addSourcesAndDocuments() {
        const { sources, gherkinDocuments } = this.gherkinDocuments.buildMessages();
        this.report.source = sources;
        this.report.gherkinDocument = gherkinDocuments;
    }
    addPickles() {
        this.report.pickle = new Pickles_1.Pickles().buildMessages(this.testCases);
    }
    addHooks() {
        this.hooks.forEach((hook) => {
            const message = hook.buildMessage();
            this.report.hook.push(message);
        });
    }
    addTestCases() {
        this.testCases.forEach((testCase) => {
            const message = testCase.buildMessage();
            this.report.testCase.push(message);
        });
    }
    addTestCaseRuns() {
        this.testCaseRuns.map((testCaseRun) => {
            const messages = testCaseRun.buildMessages();
            this.report.testCaseRuns.push(...messages);
        });
    }
    addTestRunStarted() {
        const { startTime } = this.getFullResultTiming();
        const testRunStarted = {
            timestamp: (0, timing_1.toCucumberTimestamp)(startTime.getTime()),
        };
        this.report.testRunStarted = { testRunStarted };
    }
    addTestRunFinished() {
        const { startTime, duration } = this.getFullResultTiming();
        const testRunFinished = {
            success: this.fullResult.status === 'passed',
            timestamp: (0, timing_1.toCucumberTimestamp)(startTime.getTime() + duration),
        };
        this.report.testRunFinished = { testRunFinished };
    }
    buildEventDataCollector() {
        this.emitMessages(this.eventDataCollectorEmitter);
    }
    getFullResultTiming() {
        if (this.fullResultTiming)
            return this.fullResultTiming;
        // result.startTime and result.duration were added in pw 1.37
        // see: https://github.com/microsoft/playwright/pull/26760
        if ('startTime' in this.fullResult && 'duration' in this.fullResult) {
            this.fullResultTiming = {
                startTime: this.fullResult.startTime,
                duration: this.fullResult.duration,
            };
        }
        else {
            // Calculate overall startTime and duration based on test timings
            const items = this.testCaseRuns.map((t) => t.result);
            this.fullResultTiming = (0, timing_1.calcMinMaxByArray)(items);
        }
        return this.fullResultTiming;
    }
}
exports.MessagesBuilder = MessagesBuilder;
//# sourceMappingURL=index.js.map