import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../../../config/config';
import { StorageService } from "../../storage/storage.service";
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  public car=[];
  public AppSettings = new AppSettings;
  constructor(public http: HttpClient,private stora:StorageService) {
    this.cart();
   }

  /*getPaymet(city:string):Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.AppSettings.API}get_PayMeth/`,{ observe: 'response' });
  }*/
  getPaymet(city:string):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('city',JSON.stringify(city));
    return this.http.post(`${this.AppSettings.API}get_PayMeth`,_urlParams);
  }
  getAddress(user:number):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('user',JSON.stringify(user));
    return this.http.post(`${this.AppSettings.API}get_addressU`,_urlParams);
  }
  getTransport(city):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('city',city);
    return this.http.post(`${this.AppSettings.API}get_transports`,_urlParams);
  }
  getDelivery(data,total):Observable<any>{
    console.log(data);
    
    const _urlParams: any = new FormData();
    _urlParams.append('calcform',JSON.stringify(data));
    _urlParams.append('subtotal',JSON.stringify(total));
    _urlParams.append('prods',JSON.stringify(this.car));
    return this.http.post(`${this.AppSettings.API}calc_delivery`,_urlParams);
  }
  async cart(): Promise<void>{
    let f = await this.stora.get('cart');
    console.log(f);
    this.car =f;
  }
  sendOrder(order:any,total:number,isLogged,user):Observable<any>{
    if (isLogged>0) {
      order.Uid=user.id;
    }
    order.total=total;
    order.isLogged=isLogged;
    const _urlParams: any = new FormData();
    _urlParams.append('payform',JSON.stringify(order));
    _urlParams.append('prods',JSON.stringify(this.car));
    return this.http.post(`${this.AppSettings.API}send_order`,_urlParams);
  }
}
