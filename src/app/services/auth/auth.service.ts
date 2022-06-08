import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AppSettings } from '../../config/config';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public AppSettings = new AppSettings;

  constructor(public http: HttpClient) { }


  login(data: { user: any; password: any; }):Observable<any>{
    const _urlParams: any = new FormData();
    _urlParams.append('username',data.user);
    _urlParams.append('pass',data.password);

    return this.http.post(`${this.AppSettings.API}loginForm`,_urlParams);
  }
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
}
