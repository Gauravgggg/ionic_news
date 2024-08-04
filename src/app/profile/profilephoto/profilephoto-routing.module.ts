import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilephotoPage } from './profilephoto.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilephotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilephotoPageRoutingModule {}
