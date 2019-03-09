import { Injectable } from '@angular/core';
import { UserStructure } from '../models/userStructure';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BasicApisService {

  constructor(private http: Http) { }

  doesOrgExists(org: string) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:4600/org/details/' + org, {headers: header})
    .pipe(map(res => res.text()));
  }
}
