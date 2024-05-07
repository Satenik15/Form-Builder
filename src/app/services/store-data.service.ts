import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IQuestion } from "../models/question.model";
import { IQuestionType } from "../models/answer-type.model";

@Injectable({
    providedIn: 'root'
})
export class StoreDataService {
    private _questions$: BehaviorSubject<IQuestion[]> = new BehaviorSubject<IQuestion[]>([]);
    public questions$ = this._questions$.asObservable();

    private _isFormShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isFormShown$ = this._isFormShown$.asObservable();

    private _unansweredQuestions$: BehaviorSubject<IQuestionType[]> = new BehaviorSubject<IQuestionType[]>([]);
    public unansweredQuestions$ = this._unansweredQuestions$.asObservable();

    changeShowState(value: boolean) {
        this._isFormShown$.next(value);
    }

    addNewQuestion(data: IQuestion[]) {
        this._questions$.next([...this._questions$.value, ...data]);
    }

    addUnansweredQuestion(data: IQuestionType[]) {
        if(data.length) {
            this._unansweredQuestions$.next([...data])
        } else {
            this._unansweredQuestions$.next([]);
        }
    }
}