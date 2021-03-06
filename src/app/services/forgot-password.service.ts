import { Injectable } from '@angular/core';
import { ForgotPass } from '../models/forgotPass';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { config } from '../../../config/default';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: Http) { }

  forgotPass(userData: ForgotPass) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post(config.url1 + 'forgot-password/reset', userData, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }

  changePass(newPass, token, email) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Bearer ' + token);
    return this.http.put(config.url1 + 'forgot-password/change/' + email, newPass, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}
