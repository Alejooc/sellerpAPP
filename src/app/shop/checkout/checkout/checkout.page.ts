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
  transport: any;
  selecCity: any;
  deliveryPrice: any=0;
  addresSelect: number;
  constructor(private formBuilder:FormBuilder,
    private storage:StorageService,
    private auth:AuthService,
    private servicePro:ProfileService,
    private checkServide:CheckoutService,
    route:ActivatedRoute,
    public alertController: AlertController,
    private router:Router) { 
      route.params.subscribe(async val => {
        this.total =0;
        const data=  await this.storage.get('userData') || [];
        this.cart =  await this.storage.get('cart') || [];
        this.checkoutForm.reset();
        await this.load();
        if (data.length==0) {
          this.login=false;
          this.logg=0;
        }else{
          this.login=true;
          this.user= data.decode.info
          this.checkServide.getAddress(data.decode.info.id).subscribe(resp=>{
            this.logg=1;
            this.myAddress= resp.data;
            this.storage.set('address',this.myAddress[0]);
            this.checkoutForm.get('city').setValue(this.myAddress[0].city);
            this.checkoutForm.get('dep').setValue(this.myAddress[0].state);
            this.checkoutForm.get('barrio').setValue(this.myAddress[0].nbh);
            this.checkoutForm.get('address').setValue(this.myAddress[0].address)

          })
          this.checkoutForm.get('name').setValue(data.decode.info.name)
          this.checkoutForm.get('doc').setValue(data.decode.info.docid)
          this.checkoutForm.get('email').setValue(data.decode.info.email)
          this.checkoutForm.get('phone').setValue(data.decode.info.phone)
        }
      
      });
    }
    async load(){
      this.total =0;
      //this.total = await this.storage.getTotalCart('cart');
      this.cart = await this.storage.get('cart') || []; // trae el carrito;
      if (this.cart.length >0) {
        this.cart.forEach((prod: { val: number; qty: number; }) => {
          this.total = this.total+(prod.val*prod.qty);
        });
        this.ctotal =this.total;
      }else{
        this.total = 0;
      }
    }
    async presentAlert(msg,type) {
      if (type!=1) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alerta',
          message: msg,
          buttons: [{
            text:'Salir',
            handler:()=>{
              this.router.navigate(['/cart']);
            }
          }]
        });
        await alert.present();
      }else{
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alerta',
          message: msg,
          buttons: [{
            text:'Entendido',
            handler:()=>{
              this.router.navigate(['/']);
            }
          }]

        });
        await this.storage.removeKey('cart');
        await alert.present();
      }
      
  
      

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
          transp:["",[Validators.required]],
          isLogged:this.logg,
        }
      )
    }
    submitForm(){
      console.log( this.checkoutForm.value);

      if (this.checkoutForm.invalid) {
        console.warn('empty form');
        this.presentAlert('Complete el formulario',0);
      }else{
        this.checkServide.sendOrder(this.checkoutForm.value,this.total,this.logg,this.user).subscribe(resp=>{
          console.log(resp);
          if (resp.tipo ==1) {
            this.presentAlert(resp.msg,1);
          }else{
            this.presentAlert(resp.msg,resp.tipo);
          }
          
        })
      }
      
    }
    calcDelivery(){
      this.checkServide.getDelivery(this.checkoutForm.value,this.total).subscribe(resp=>{
        console.log(resp);
        this.deliveryPrice = resp.info.delivery;
        this.ctotal = resp.total;
      })
    }
    citysApl(ev:any){
      this.cit=[];
      this.checkoutForm.controls['city'].reset();
      this.citys.forEach(element => {
        if (element.state == ev.detail.value ) {
          this.cit.push(element)
        }
      });
      this.calcDelivery();
    }
    paym(ev:any){
      this.checkoutForm.controls['payme'].reset();
      this.selecCity=ev.detail.value;
      const selectCity=ev.detail.value;
      this.checkServide.getPaymet(selectCity).subscribe(resp=>{
        this.payme=resp.data;
      })
      this.checkServide.getTransport(ev.detail.value).subscribe(resp=>{
        this.transport=resp.data;
      })
      this.calcDelivery();
    }
    selectAddress(address:number,city){
      this.calcDelivery();
      this.addresSelect=address;
      console.log(this.selecCity);
      this.checkServide.getTransport(city).subscribe(resp=>{
        console.log(resp);
        this.transport=resp.data;
      })
      this.checkServide.getPaymet(city).subscribe(resp=>{
        this.payme=resp.data;
      })
      
    }

}
