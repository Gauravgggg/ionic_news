import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewslistPageRoutingModule } from './newslist-routing.module';

import { NewslistPage } from './newslist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewslistPageRoutingModule
  ],
  declarations: [NewslistPage]
})
export class NewslistPageModule {}
