import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScreenLoadingPage } from './screen-loading.page';

const routes: Routes = [
  {
    path: '',
    component: ScreenLoadingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScreenLoadingPageRoutingModule {}
