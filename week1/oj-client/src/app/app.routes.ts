import {Router, RouterModule, Routes} from '@angular/router';
import {ProblemListComponent} from './components/problem-list/problem-list.component';
import {ProblemDetialComponent} from './components/problem-detial/problem-detial.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'problems',
    pathMatch: 'full'
  },
  {
    path: 'problems',
    component: ProblemListComponent
  },
  {
    path: 'problems/:id',
    component: ProblemDetialComponent
  },
  {
    path: '**',
    redirectTo: 'problems'
  }
];

export const routing = RouterModule.forRoot(routes);
