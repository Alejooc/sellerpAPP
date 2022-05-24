import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderimgComponent } from "./sliderimg/sliderimg.component";
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { CategoriesliderComponent } from "./categorieslider/categorieslider.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ModalCompComponent } from "./modal-comp/modal-comp.component";
@NgModule({
  declarations: [ToolbarComponent,SliderimgComponent,CategoriesliderComponent,ModalCompComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    SwiperModule
  ],exports:[ToolbarComponent,SliderimgComponent,CategoriesliderComponent,ModalCompComponent]
 
})
export class CompsModule { }
