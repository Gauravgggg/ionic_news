import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsdetailPage } from './newsdetail.page';

const routes: Routes = [
  {
    path: '',
    component: NewsdetailPage
  },
  {
    path: 'qand-a',
    loadChildren: () => import('./qand-a/qand-a.module').then( m => m.QandAPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsdetailPageRoutingModule {}
