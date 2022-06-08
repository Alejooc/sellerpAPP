import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../../../config/config';
import { ModalController } from '@ionic/angular';
import { PagemodalPage } from '../../components/modal-comp/pagemodal/pagemodal.page';
@Injectable({
  providedIn: 'root'
})
export class PagemodalService {

  public AppSettings = new AppSettings;
  constructor(public http: HttpClient,public pg:ModalController) { }
   //informacion del cupon
   getCupon(cupon: any,cart:any):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('cupon', cupon);
    _urlParams.append('cartVal', cart);
    return this.http.post(`${this.AppSettings.API}get_validateCupon`,_urlParams);
  }
  
  dismiss() {
    this.pg.dismiss({
      component:PagemodalPage,
      'dismissed': true
    });
  }
}
