import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilephotoPageRoutingModule } from './profilephoto-routing.module';

import { ProfilephotoPage } from './profilephoto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilephotoPageRoutingModule
  ],
  declarations: [ProfilephotoPage]
})
export class ProfilephotoPageModule {}
