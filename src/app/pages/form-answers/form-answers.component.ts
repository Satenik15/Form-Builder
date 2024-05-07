import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

import { StoreDataService } from 'src/app/services/store-data.service';
import { IQuestion } from 'src/app/models/question.model';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './form-answers.component.html',
  styleUrl: './form-answers.component.scss',
})
export class FormAnswersComponent {
  questions$: Observable<IQuestion[]> = new Observable();
  storeService = inject(StoreDataService);

  constructor() {
    this.questions$ = this.storeService.questions$;
  }
}
