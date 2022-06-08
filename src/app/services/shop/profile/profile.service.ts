import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../../../config/config';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public AppSettings = new AppSettings;
  constructor(public http: HttpClient) { }

  //ordenes del usuario
  getProData(type:number,user:boolean):Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.AppSettings.API}get_profileData/${type}/${user}`,{ observe: 'response' });
  }
  getStates():Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.AppSettings.API}statesCitys/`,{ observe: 'response' });
  }
  save(data:any):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('addressform',JSON.stringify(data));
    return this.http.post(`${this.AppSettings.API}create_address`,_urlParams);
  }
}
