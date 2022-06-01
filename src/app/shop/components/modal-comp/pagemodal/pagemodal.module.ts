import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PagemodalPageRoutingModule } from './pagemodal-routing.module';

import { PagemodalPage } from './pagemodal.page';
import { CompsModule } from "../../comps.module";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagemodalPageRoutingModule,CompsModule,ReactiveFormsModule
  ],
  declarations: [PagemodalPage]
})
export class PagemodalPageModule {}
