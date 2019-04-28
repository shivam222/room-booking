import { Injectable } from '@angular/core';
import { UserStructure } from '../models/userStructure';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { config } from '../../../config/default';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {

  constructor(private http: Http) { }

  orgRegister(newUserData: UserStructure) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post(config.url1 + 'org-register/new', newUserData, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}
