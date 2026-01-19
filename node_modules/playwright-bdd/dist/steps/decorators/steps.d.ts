/**
 * Define steps via decorators.
 */
import { StepConfig } from '../stepConfig';
import { PomNode } from './pomGraph';
import { DefineStepPattern, GherkinStepKeyword } from '../registry';
/**
 * Creates @Given, @When, @Then decorators.
 */
export declare function createStepDecorator(keyword: GherkinStepKeyword): (pattern: DefineStepPattern) => (method: StepConfig['fn'], _context: ClassMethodDecoratorContext) => void;
export declare function linkStepsWithPomNode(Ctor: Function, pomNode: PomNode): void;
//# sourceMappingURL=steps.d.ts.map