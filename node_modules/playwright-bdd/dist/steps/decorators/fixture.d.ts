/**
 * Class level @Fixture decorator.
 */
import { TestType } from '@playwright/test';
import { KeyValue } from '../../playwright/types';
type AvailableFixtures<T extends KeyValue> = T extends TestType<infer U, infer W> ? U & W : T;
type AvailableFixtureName<T extends KeyValue> = Omit<keyof AvailableFixtures<T>, number | symbol>;
export declare function Fixture<T extends KeyValue>(fixtureName: AvailableFixtureName<T>): (Ctor: Function, _context: ClassDecoratorContext) => void;
export {};
//# sourceMappingURL=fixture.d.ts.map