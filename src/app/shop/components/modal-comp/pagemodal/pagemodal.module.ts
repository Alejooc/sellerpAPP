import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagemodalPageRoutingModule } from './pagemodal-routing.module';

import { PagemodalPage } from './pagemodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagemodalPageRoutingModule
  ],
  declarations: [PagemodalPage]
})
export class PagemodalPageModule {}
