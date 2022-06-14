import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService} from "../../../services/storage/storage.service";
import { AuthService } from "../../../services/auth/auth.service";
import { ProfileService } from "../../../services/shop/profile/profile.service";
import {ActivatedRoute,Router } from '@angular/router';
import { CheckoutService } from "../../../services/shop/checkout/checkout.service";
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
    route:ActivatedRoute) { 
      route.params.subscribe(async val => {
        const data=  await this.storage.get('userData') || [];
        this.ctotal = await this.storage.getTotalCart('cart');
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


    ngOnInit() {     
      this.servicePro.getStates().subscribe(resp=>{
        this.states=resp.body.states;
        this.citys=resp.body.citys;
      })
      this.cart =  this.storage.get('cart') || [];

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
          isLogged:[this.logg],
          total:[this.ctotal]
        }
      )
    }
    submitForm(){
      if (this.checkoutForm.invalid) {
        console.warn('empty form');
        
      }else{
        this.checkServide.sendOrder(this.checkoutForm.value).subscribe(resp=>{
          console.log(resp);
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
