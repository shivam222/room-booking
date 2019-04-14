import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';

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
     return this.http.put('http://localhost:4600/rooms/booking/' + roomId, bookData, {headers: header})
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
    return this.http.delete('http://localhost:4600/rooms/booking/delete/' + roomId + '/' + date, {headers: header, search: params})
    .pipe(map(res => {
      return res.json();
    })
    );
  }

  isTokenValid(token: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:4600/token/check/', {headers: header})
    .pipe(first(res => {
      return res.json();
    })
    );
  }

  deleteRoom(token: string, roomId: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.delete('http://localhost:4600/rooms/delete/' + roomId, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}
