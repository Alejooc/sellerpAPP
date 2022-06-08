import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';
import { AppSettings } from "../../../config/config";

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);
@Component({
  selector: 'app-sliderimg',
  templateUrl: './sliderimg.component.html',
  styleUrls: ['./sliderimg.component.scss'],
})
export class SliderimgComponent implements OnInit {
  api = new AppSettings();
  @Input()
  imgs: any;
  @Input()
  etiqueta: any;
  @Input()
  imgpromo: any;
  
  constructor() { }

  ngOnInit() {
  }

}
