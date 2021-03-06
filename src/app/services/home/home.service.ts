import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public AppSettings = new AppSettings;
  constructor(public http: HttpClient) { }
  


  // home data logos and more
  getHome():Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.AppSettings.API}get_storeData`,{ observe: 'response' });
  }
  getCategories():Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.AppSettings.API}get_categories`,{ observe: 'response' });
  }

   // shop  products
   getProductsC(param:string,pag:number,cat:any):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('fil', JSON.stringify({
      'search':param,
      'category':cat,
      'pag':pag
    }));
    return this.http.post(`${this.AppSettings.API}get_products`,_urlParams);
  }

  search(param:string,cat:string,pag:number):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('fil', JSON.stringify({
      'category':cat,
      'search':param,
      'pag':pag
    }));
    return this.http.post(`${this.AppSettings.API}get_products`,_urlParams);
  }
}
