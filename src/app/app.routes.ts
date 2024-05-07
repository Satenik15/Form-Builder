import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { FormBuilderComponent } from './pages/form-builder/form-builder.component';
import { FormAnswersComponent } from './pages/form-answers/form-answers.component';

export const appRoutes: Route[] = [
    {
        path: 'form',
        component: AppComponent,
        children: [
            {
                path: 'builder',
                component: FormBuilderComponent
            },
            {
                path: 'answers',
                component: FormAnswersComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'form/builder'
    }
];
