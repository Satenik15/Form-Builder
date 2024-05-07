export interface IQuestionType {
    answers: IAnswer[];
    question: string;
    questionType: string;
    required: boolean;
    specificAnswer: boolean;
    answer?: string[] | string;
    otherAnswer: string;
}

export interface IAnswer {
    answer: string;
}