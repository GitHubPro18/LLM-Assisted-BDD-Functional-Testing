import { Fixture } from './steps/decorators/fixture';
export { Fixture };
export declare const Given: (pattern: import("./steps/registry").DefineStepPattern) => (method: (...args: any[]) => unknown, _context: ClassMethodDecoratorContext<unknown, (this: unknown, ...args: any) => any>) => void;
export declare const When: (pattern: import("./steps/registry").DefineStepPattern) => (method: (...args: any[]) => unknown, _context: ClassMethodDecoratorContext<unknown, (this: unknown, ...args: any) => any>) => void;
export declare const Then: (pattern: import("./steps/registry").DefineStepPattern) => (method: (...args: any[]) => unknown, _context: ClassMethodDecoratorContext<unknown, (this: unknown, ...args: any) => any>) => void;
export declare const Step: (pattern: import("./steps/registry").DefineStepPattern) => (method: (...args: any[]) => unknown, _context: ClassMethodDecoratorContext<unknown, (this: unknown, ...args: any) => any>) => void;
//# sourceMappingURL=decorators.d.ts.map