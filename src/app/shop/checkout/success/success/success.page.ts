import { Component, OnInit } from '@angular/core';
import { SuccessService } from "../../../../services/shop/success/success.service";
import {ActivatedRoute,Router } from '@angular/router';
import { AppSettings } from "../../../../config/config";

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  api = new AppSettings();
  payment:string;
  orderData:any=[];
  orderD:any;
  slug = this.route.snapshot.params.order; // obtener el slug para buscar el producto -> API
  constructor(private service:SuccessService,public route:ActivatedRoute) { }

  ngOnInit() {
    this.service.getOrderSuccess(this.slug).subscribe(resp=>{
      console.log(resp);
      this.payment=resp.payment.detail;
      this.orderData=resp.orden;
      this.orderD=resp.ordenD;
    })
    
    
  }

}
