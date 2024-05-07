import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

import { FormBuilderDialogComponent } from './form-builder-dialog/form-builder-dialog.component';
import { StoreDataService } from 'src/app/services/store-data.service';
import { IQuestion } from 'src/app/models/question.model';
import { QuestionTypeEnum } from 'src/app/models/question-type.enum';
import { IQuestionType } from 'src/app/models/answer-type.model';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss',
})
export class FormBuilderComponent implements OnInit {
  isFormShown = signal(false);
  errorMsg = signal('');
  answerList = signal<{ [key: string]: string[] }>({});
  isFormShown$: Observable<boolean> = new Observable();
  unansweredQuestions$: Observable<boolean> = new Observable();

  QuestionTypeEnum = QuestionTypeEnum;

  dialog = inject(MatDialog);
  router = inject(Router);
  storeService = inject(StoreDataService);

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    questions: this.formBuilder.array([])
  });

  get questions() {
    return this.form.controls["questions"] as FormArray;
  }

  constructor() {
    this.isFormShown$ = this.storeService.isFormShown$;
  }

  ngOnInit(): void {
    this.storeService.unansweredQuestions$.pipe(take(1)).subscribe((questions: IQuestionType[]) => {
      if (questions.length) {
        questions.map((question: IQuestionType) => {
          this.createQuestionsForm(question);
        })
      }
    })
  }

  openFormBuilderDialog() {
    this.storeService.changeShowState(true);
    this.isFormShown.set(true);

    const dialogRef = this.dialog.open(FormBuilderDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((data: IQuestionType) => {
      this.createQuestionsForm(data);
    });
  }

  createQuestionsForm(data: IQuestionType) {
    const answers = data?.answers.map((value: { answer: string }) => {
      return {
        ...value,
        checked: false
      }
    })

    if (data) {
      const answerForm = this.formBuilder.group({
        question: [data.question],
        questionType: [data.questionType],
        answers: [answers],
        answer: [[], (data.questionType === QuestionTypeEnum.Paragraph && data.required) ? Validators.required : null],
        required: [data.required],
        specificAnswer: [data.specificAnswer],
        isOther: [false],
        otherAnswer: [''],
      });
      this.questions.push(answerForm);
    }
  }

  onChange(value: MatCheckboxChange, answer: string, index: number) {
    this.errorMsg.set('');
    if (value.checked) {
      this.answerList.update((value: { [key: string]: string[] }) => {
        if (value[index]) {
          value[index] = [...value[index], answer];
        } else {
          value[index] = [answer];
        }
        return value
      })
    } else {
      this.answerList.update((value: { [key: string]: string[] }) => {
        value[index] = value[index].filter((value: string) => value !== answer);
        return value
      })
    }
  }

  storeUnansweredQuestions() {
    const unansweredQuestions: IQuestionType[] = this.questions?.value.filter((value: IQuestionType, index: number) => {
      return this.getUnAnsweredQuestion(value, index)
    });
    this.storeService.addUnansweredQuestion(unansweredQuestions);
  }

  getUnAnsweredQuestion(question: IQuestionType, index: number) {
    return (!question.required && (((question.questionType === QuestionTypeEnum.Paragraph && (!question.answer || !question.answer.length)))
      || (question.questionType === QuestionTypeEnum.Checkbox && ((!this.answerList()[index] || (this.answerList()[index] && !this.answerList()[index]?.length)) && !question.otherAnswer))))
  }

  onNavigate() {
    if (this.form.valid) {
      let isInValid = false;

      const data: IQuestion[] = [];
      this.questions?.value.some((value: IQuestionType, index: number) => {
        isInValid = (value.questionType === QuestionTypeEnum.Checkbox && value.required &&
          (!this.answerList()[index] || (this.answerList()[index] && !this.answerList()[index]?.length)) && !value.otherAnswer);

        if (isInValid) {
          this.errorMsg.set('Checkbox value is required!')
          return;
          
        } else {

          if (this.getUnAnsweredQuestion(value, index)) {
            return;

          } else {
            data.push({
              question: value.question,
              answers: (value.questionType === QuestionTypeEnum.Paragraph ? [value.answer] : this.answerList()[index]) as string[],
              required: value.required,
              otherAnswer: value.otherAnswer || ''
            })
          }
        }
      })

      if (!isInValid) {
        this.storeUnansweredQuestions();
        this.storeService.addNewQuestion(data);
        this.router.navigate(['form', 'answers']);
      }
    }
  }
}
