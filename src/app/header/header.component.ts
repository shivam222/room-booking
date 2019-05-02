import { Component, OnInit } from '@angular/core';
import { BasicApisService } from '../services/basic-apis.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean;
  constructor( public basicApi: BasicApisService) { }

  ngOnInit() {
    this.isLogged = this.basicApi.isLoggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userOrg');
    localStorage.removeItem('currentRoom');
    localStorage.removeItem('currentDate');
  }
}
