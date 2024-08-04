import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewslistPage } from './newslist.page';

const routes: Routes = [
  {
    path: '',
    component: NewslistPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewslistPageRoutingModule {}
