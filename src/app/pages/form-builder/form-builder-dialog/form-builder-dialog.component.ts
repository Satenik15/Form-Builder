import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

import { QuestionTypeEnum } from 'src/app/models/question-type.enum';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './form-builder-dialog.component.html',
  styleUrl: './form-builder-dialog.component.scss',
})
export class FormBuilderDialogComponent {
  private formBuilder = inject(FormBuilder);

  QuestionTypeEnum = QuestionTypeEnum;
  
  dialogRef = inject(MatDialogRef<FormBuilderDialogComponent>)

  form = this.formBuilder.group({
    questionType: ['', Validators.required],
    question: ['', Validators.required],
    specificAnswer: [false],
    required: [false],
    answers: this.formBuilder.array([])
  });

  get answers() {
    return this.form.controls["answers"] as FormArray;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if(this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  addAnswer() {
    const answerForm = this.formBuilder.group({
      answer: ['', Validators.required],
    });
    this.answers.push(answerForm);
  }

  onQuestionTypeChange() {
    if(this.form.controls.questionType.value === QuestionTypeEnum.Checkbox) {
      this.addAnswer();
    } else {
      this.answers.clear();
    }
  }

}
