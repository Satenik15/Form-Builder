import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilderComponent } from './pages/form-builder/form-builder.component';

@Component({
  standalone: true,
  imports: [RouterModule, FormBuilderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app';
}
