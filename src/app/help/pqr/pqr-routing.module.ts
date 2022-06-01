import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PqrPage } from './pqr.page';

const routes: Routes = [
  {
    path: ':user',
    component: PqrPage
  },
  {
    path: '',
    component: PqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PqrPageRoutingModule {}
