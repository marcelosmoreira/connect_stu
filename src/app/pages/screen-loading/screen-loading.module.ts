import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScreenLoadingPageRoutingModule } from './screen-loading-routing.module';

import { ScreenLoadingPage } from './screen-loading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScreenLoadingPageRoutingModule
  ],
  declarations: [ScreenLoadingPage]
})
export class ScreenLoadingPageModule {}
