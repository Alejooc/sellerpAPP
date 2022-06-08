import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../../../config/config';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public AppSettings = new AppSettings;
  constructor(public http: HttpClient) { }

  //informacion del producto 
  getProduct(prod: any,slug: any):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('slug', slug);
    _urlParams.append('product', prod);

    return this.http.post(`${this.AppSettings.API}get_product`,_urlParams);
  }
}
