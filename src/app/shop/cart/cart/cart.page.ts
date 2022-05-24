import { Component, OnInit } from '@angular/core';
import {  StorageService} from "../../../services/storage/storage.service";
import { AppSettings } from "../../../config/config";
import { ModalController } from '@ionic/angular';
import { PagemodalPage } from '../../components/modal-comp/pagemodal/pagemodal.page';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  api = new AppSettings();
  cart: any;

  constructor(private storage:StorageService,public modalController: ModalController) { }
  
  async ngOnInit() {
      this.cart = await this.storage.get('cart') || []; // trae el carrito
      console.log(this.cart);
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: PagemodalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  
  public async delItem(index:number){
    await this.storage.remove(index)
    this.cart.splice(index,1);
    await this.ngOnInit();
  }
  quitarCart(id) {
    const indice = this.cart.findIndex(p => p.id === id);
    if (indice != -1) {
       this.cart.splice(indice, 1);
        
    } 
  }
  add(e){
    console.log('agregando cantidad al producto ');
    let prodd= this.cart.find(produc => produc.id === e);
    prodd.qty=parseInt(prodd.qty)+1;
    this.quitarCart(prodd.id);
    this.cart.push(prodd);
    this.storage.set('cart',this.cart);
  }
  rev(e){
    console.log('restando cantidad al producto ');
    let prodd= this.cart.find(produc => produc.id === e);
    if (prodd.qty>=2) {
      prodd.qty=parseInt(prodd.qty)-1;
      this.quitarCart(prodd.id);
      this.cart.push(prodd);
      this.storage.set('cart',this.cart);
    }
    
  }
}
