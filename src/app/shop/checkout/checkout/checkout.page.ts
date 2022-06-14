import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService} from "../../../services/storage/storage.service";
import { AuthService } from "../../../services/auth/auth.service";
import { ProfileService } from "../../../services/shop/profile/profile.service";
import {ActivatedRoute,Router } from '@angular/router';
import { CheckoutService } from "../../../services/shop/checkout/checkout.service";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  checkoutForm:FormGroup;
  activeDes:boolean=false;
  total:number=0;
  perdesc:any;
  perCurrenc:any;
  totalDesc:number=0;
  login:boolean=true;
  cit: any[];
  citys: any;
  states: any;
  payme: any[];
  user: any;
  myAddress:any[];
  cart: any;
  logg: any;
  ctotal:any;
  constructor(private formBuilder:FormBuilder,
    private storage:StorageService,
    private auth:AuthService,
    private servicePro:ProfileService,
    private checkServide:CheckoutService,
    route:ActivatedRoute,
    public alertController: AlertController) { 
      route.params.subscribe(async val => {
        const data=  await this.storage.get('userData') || [];
        this.cart =  await this.storage.get('cart') || [];
        await this.load();
        if (data.length==0) {
          this.login=false;
          this.logg=0;
        }else{
          this.checkServide.getAddress(data.decode.info.id).subscribe(resp=>{
            console.log(resp);
            this.myAddress= resp.data;
            this.storage.set('address',this.myAddress[0]);
            this.logg=1;
          })
        }
      
      });
    }
    async load(){
      //this.total = await this.storage.getTotalCart('cart');
      this.cart = await this.storage.get('cart') || []; // trae el carrito;
      if (this.cart.length >0) {
        this.cart.forEach((prod: { val: number; qty: number; }) => {
          this.total = this.total+(prod.val*prod.qty);
        });
        
      }else{
        this.total = 0;
      }
    }
    async presentAlert(msg) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        subHeader: 'Subtitle',
        message: msg,
        buttons: ['OK']
      });
  
      await alert.present();
  
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
    ngOnInit() {     
      this.servicePro.getStates().subscribe(resp=>{
        this.states=resp.body.states;
        this.citys=resp.body.citys;
      })
      this.checkoutForm= this.formBuilder.group(
        {
          name:["",[Validators.required]],
          doc:["",[Validators.required]],
          email:[""],
          address:["",[Validators.required]],
          phone:["",[Validators.required]],
          dep:["",[Validators.required]],
          city:["",[Validators.required]],
          barrio:["",[Validators.required]],
          payme:["",[Validators.required]],
          isLogged:this.logg,
          total:this.ctotal
        }
      )
    }
    submitForm(){
      if (this.checkoutForm.invalid) {
        console.warn('empty form');
        
      }else{
        this.checkServide.sendOrder(this.checkoutForm.value).subscribe(resp=>{
          console.log(resp);
          this.presentAlert(resp.msg);
        })
      }
      
    }
    citysApl(ev:any){
      this.cit=[];
      this.checkoutForm.controls['city'].reset();
      this.citys.forEach(element => {
        if (element.state == ev.detail.value ) {
          this.cit.push(element)
        }
      });
    }
    paym(ev:any){
      this.checkoutForm.controls['payme'].reset();
      console.log(ev);
      const selectCity=ev.detail.value;
      this.checkServide.getPaymet(selectCity).subscribe(resp=>{
        this.payme=resp.data;
      })
    }
    selectAddress(address:number){
      console.log(address);
      
    }

}
