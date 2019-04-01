import { Injectable } from '@angular/core';
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
    return this.http.get('http://localhost:4600/org/exist/' + org, {headers: header})
    .pipe(map(res => res.text()));
  }

  doesEmailExists(email: string) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:4600/email/exist/' + email, {headers: header})
    .pipe(map(res => res.text()));
  }

  isLoggedIn(): boolean {
  if (localStorage.getItem('token') === null) {
      return false;
  } else {
      return true;
  }
  }

  getAllRooms(token: string, orgName: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:4600/rooms/all/' + orgName, {headers: header})
    .pipe(map(res => res.json()));
  }

  addRoom(token: string, org: string, name: string) {
    const roomData = {
     org,
     name
    };
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Bearer ' + token);
    return this.http.post('http://localhost:4600/rooms/new', roomData, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}
