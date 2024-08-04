import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSettingSectionsPage } from './new-setting-sections.page';

const routes: Routes = [
  {
    path: '',
    component: NewSettingSectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSettingSectionsPageRoutingModule {}
