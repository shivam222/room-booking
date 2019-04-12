import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BasicApisService } from './services/basic-apis.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  private subscription1: Subscription;
  constructor(private basicApi: BasicApisService) { }
  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.subscription1 = this.basicApi.isTokenValid(localStorage.getItem('token'))
      .subscribe( res => {
          console.log('Valid User');
      }, err => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userOrg');
        localStorage.removeItem('currentRoom');
        localStorage.removeItem('currentDate');
      });
    }
  }
}
