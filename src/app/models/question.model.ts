export interface IQuestion {
    question: string;
    answers: string[];
    required: boolean;
    otherAnswer?: string;
}