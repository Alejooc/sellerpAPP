import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PagemodalPage } from './pagemodal/pagemodal.page';
@Component({
  selector: 'app-modal-comp',
  templateUrl: './modal-comp.component.html',
  styleUrls: ['./modal-comp.component.scss'],
})
export class ModalCompComponent implements OnInit {

  // The `ion-modal` element reference.
  modal: HTMLElement;

  constructor(public modalController: ModalController) {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: PagemodalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  ngOnInit() {}

}
