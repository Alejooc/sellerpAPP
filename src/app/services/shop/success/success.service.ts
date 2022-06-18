import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../../../config/config';
import { StorageService } from "../../storage/storage.service";
@Injectable({
  providedIn: 'root'
})
export class SuccessService {
  public AppSettings = new AppSettings;
  constructor(public http: HttpClient,private stora:StorageService) {
   }

  /*getPaymet(city:string):Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.AppSettings.API}get_PayMeth/`,{ observe: 'response' });
  }*/
  getOrderSuccess(order:string):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('order',order);
    return this.http.post(`${this.AppSettings.API}get_orderSuccess`,_urlParams);
  }
  
}
