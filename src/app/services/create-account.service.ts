import { Injectable } from '@angular/core';
import { UserStructure } from '../models/userStructure';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {

  constructor(private http: Http) { }

  orgRegister(newUserData: UserStructure) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:4600/org-register/new', newUserData, {headers: header})
    .pipe(map(res => res.text()));
  }
}
