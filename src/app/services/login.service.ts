import { Injectable } from '@angular/core';
import { LoginStructure } from '../models/loginStructure';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http) { }

  login(userData: LoginStructure) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:4600/log-in/authenticate', userData, {headers: header})
    .pipe(map(res => res.text()));
  }
}
