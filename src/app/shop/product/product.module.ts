import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { CompsModule } from "../components/comps.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    CompsModule
  ],
  declarations: [ProductPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProductPageModule {}
