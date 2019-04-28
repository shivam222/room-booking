import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { config } from '../../../config/default';

@Injectable({
  providedIn: 'root'
})
export class BasicApisService {

  constructor(private http: Http) { }

  doesOrgExists(org: string) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.get(config.url1 + 'org/exist/' + org, {headers: header})
    .pipe(map(res => res.text()));
  }

  doesEmailExists(email: string) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.http.get(config.url1 + 'email/exist/' + email, {headers: header})
    .pipe(map(res => res.text()));
  }

  isLoggedIn(): boolean {
  if (localStorage.getItem('token') === null) {
      return false;
  } else {
      return true;
  }
  }

  getUserRole() {
    if (localStorage.getItem('userRole')) {
      return localStorage.getItem('userRole');
    }
  }

  getAllRooms(token: string, orgName: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.get(config.url1 + 'rooms/all/' + orgName, {headers: header})
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
    return this.http.post(config.url1 + 'rooms/new', roomData, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }

  newBooking(roomId, date, data, org, token, name) {
    const bookData = {
      org,
      name,
      date,
      from: data.from,
      to: data.to,
      des: data.des
     };
     const header = new Headers();
     header.append('Content-Type', 'application/json');
     header.append('Authorization', 'Bearer ' + token);
     return this.http.put(config.url1 + 'rooms/booking/' + roomId, bookData, {headers: header})
     .pipe(map(res => {
       return res.json();
     })
     );
  }

  deleteRoomBooking(roomId: string, date: string, booking, token: string) {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Bearer ' + token);
    const params = new URLSearchParams();
    params.set('by', booking.by);
    params.set('description', booking.description);
    params.set('from', booking.from);
    params.set('to', booking.to);
    return this.http.delete(config.url1 + 'rooms/booking/delete/' + roomId + '/' + date, {headers: header, search: params})
    .pipe(map(res => {
      return res.json();
    })
    );
  }

  isTokenValid(token: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.get(config.url1 + 'token/check/', {headers: header})
    .pipe(first(res => {
      return res.json();
    })
    );
  }

  deleteRoom(token: string, roomId: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.delete(config.url1 + 'rooms/delete/' + roomId, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}
