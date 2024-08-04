import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSettingSectionsPageRoutingModule } from './new-setting-sections-routing.module';

import { NewSettingSectionsPage } from './new-setting-sections.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewSettingSectionsPageRoutingModule
  ],
  declarations: [NewSettingSectionsPage]
})
export class NewSettingSectionsPageModule {}
