import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: Http) { }

  allUsers(token: string, org: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:4600/admin/users/' + org, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }

  deleteUser(token: string, userEmail: string) {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.delete('http://localhost:4600/admin/user/delete/' + userEmail, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }

  changeRole(token: string, email: string, newRole: string) {
    const header = new Headers();
    const newRoleObj = {newRole};
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:4600/admin/user/role/update/' + email, newRoleObj, {headers: header})
    .pipe(map(res => {
      return res.json();
    })
    );
  }
}
