import { Component, OnInit } from '@angular/core';
import {  StorageService} from "../../../services/storage/storage.service";
import { AppSettings } from "../../../config/config";
import { ModalController } from '@ionic/angular';
import { ActivatedRoute,Router } from '@angular/router';

import { PagemodalPage } from '../../components/modal-comp/pagemodal/pagemodal.page';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  api = new AppSettings();
  cart: any;
  total: number=0;
  noprods: boolean;
  totalDesc: number;
  perdesc: number;
  activeDes: boolean=false;
  perCurrenc: any;
  cupon: any;
  show:boolean=true;

  constructor(route:ActivatedRoute,private storage:StorageService,public modalController: ModalController) { 
    route.params.subscribe(async val => {

      this.cart = await this.storage.get('cart') || [];
      await this.load();
    });
  }
  
  ngOnInit() {
    
  }
  async load(){
    //this.total = await this.storage.getTotalCart('cart');
    this.cart = await this.storage.get('cart') || []; // trae el carrito;
    if (this.cart.length >0) {
      this.cart.forEach((prod: { val: number; qty: number; }) => {
        this.total = this.total+(prod.val*prod.qty);
      });
      this.noprods=false;
    }else{
      this.total = 0;
      this.noprods=true;

    }
    this.discountCheck();
  }

  async discountCheck(){
    const data = await this.storage.get('cuponData');
    if (data!=null) {
      const isobje=Object.keys(data).length === 0;
      if (isobje===false) { // si esta vacio  ==true
        this.activeDes=true;
        this.cupon = data;
        if (data.type==1) { //%% 10%
          this.perdesc=data.value;
          this.perCurrenc=(this.total * data.value)/100;
          this.totalDesc = this.total-((this.total * data.value)/100);
        }else{ // valor fijo 100000 ejm
          this.perdesc=(data.value * 100)/this.total;
          this.perCurrenc=data.value;
          this.totalDesc = this.total-data.value;
        }
      }
    }
   
    
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
    this.total =0;
    await this.load()
  }
  quitarCart(id: any) {
    const indice = this.cart.findIndex((p: { id: any; }) => p.id === id);
    if (indice != -1) {
       this.cart.splice(indice, 1);  
    } 

    return indice;
  }
  indiceCart(id: any){
    const indice = this.cart.findIndex((p: { id: any; }) => p.id === id);
    if (indice != -1) {
      return indice;  
    }  
  }
  async add(e: string){
    const prodd= await this.cart.find((produc: { id: string; }) => produc.id == e);
    prodd.qty=parseInt(prodd.qty)+1;
    const indice = this.indiceCart(prodd.id);
    this.cart[indice]=prodd;
    this.storage.set('cart',this.cart);
    this.total = this.total+parseInt(prodd.val);
    this.discountCheck();
  }
  async rev(e: string){
    const prodd= await this.cart.find((produc: { id:string; }) => produc.id == e);
    if (prodd.qty>1) {
      prodd.qty=parseInt(prodd.qty)-1;
      const indice = this.indiceCart(prodd.id);
      this.cart[indice]=prodd;
      this.storage.set('cart',this.cart);
      this.total = this.total-parseInt(prodd.val);
      this.discountCheck();
    }
    
  }
}
