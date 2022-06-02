import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PqrPageRoutingModule } from './pqr-routing.module';

import { PqrPage } from './pqr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PqrPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PqrPage]
})
export class PqrPageModule {}
