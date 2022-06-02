import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../config/config';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  public AppSettings = new AppSettings;
  constructor(public http: HttpClient) { }
  


  // home data logos and more
  getHome():Observable<HttpResponse<any>>{
    return this.http.get<any>(this.AppSettings.API+'get_storeData',{ observe: 'response' });
  }
  getCategories():Observable<HttpResponse<any>>{
    return this.http.get<any>(this.AppSettings.API+'get_categories',{ observe: 'response' });
  }

   // shop  products
   getProductsC(param:string,pag:number,cat:any):Observable<any>{
    let _urlParams: any = new FormData();
    _urlParams.append('fil', JSON.stringify({
      'search':param,
      'category':cat,
      'pag':pag
    }));
    return this.http.post(this.AppSettings.API+'get_products',_urlParams);
  }
  get_msg_ticket(ticket:number):Observable<any>{
    let _urlParams: any = new FormData();
    _urlParams.append('ticket', ticket);
    return this.http.post(this.AppSettings.API+'get_msg_ticket',_urlParams);
  }
  set_new_message(data:object,user:number,ticket:number):Observable<any>{
    console.log(data);
    let _urlParams: any = new FormData();
    _urlParams.append('data', JSON.stringify(data));
    _urlParams.append('user', user);
    _urlParams.append('ticket', ticket);

    return this.http.post(this.AppSettings.API+'set_new_messageT',_urlParams);
  }
  set_new_ticket(data:object):Observable<any>{
    console.log(data);
    let _urlParams: any = new FormData();
    _urlParams.append('data', JSON.stringify(data));
    //_urlParams.append('user', user); modificado 02-06-2022
    return this.http.post(this.AppSettings.API+'set_new_ticket',_urlParams);
  }
}
