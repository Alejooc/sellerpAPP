import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagemodalPage } from './pagemodal.page';

const routes: Routes = [
  {
    path: '',
    component: PagemodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagemodalPageRoutingModule {}
