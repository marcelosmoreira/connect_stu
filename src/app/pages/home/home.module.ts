import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';  // Certifique-se de que está importado

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule  // Verifique se isso está aqui
  ],
  declarations: [HomePage],
  exports: [HomePage]
})
export class HomePageModule {}
