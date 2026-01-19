export declare enum KeywordType {
    Precondition = "precondition",
    Event = "event",
    Outcome = "outcome"
}
interface IGetStepKeywordTypeOptions {
    keyword: string;
    language: string;
    previousKeywordType?: KeywordType;
}
export declare function getStepKeywordType({ keyword, language, previousKeywordType, }: IGetStepKeywordTypeOptions): KeywordType;
export {};
//# sourceMappingURL=keywordType.d.ts.map