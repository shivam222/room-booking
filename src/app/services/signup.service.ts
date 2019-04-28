import { Injectable } from '@angular/core';
import { UserStructure } from '../models/userStructure';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { config } from '../../../config/default';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: Http) { }

  signup(newUserData: UserStructure) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.post(config.url1 + 'sign-up/new', newUserData, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}
