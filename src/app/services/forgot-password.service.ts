import { Injectable } from '@angular/core';
import { ForgotPass } from '../models/forgotPass';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: Http) { }

  forgotPass(userData: ForgotPass) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:4600/forgot-password/reset', userData, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}