import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userName: string;
  userEmail: string;
  userOrg: string;
  userRole: string;
  isAdmin: boolean;
  roleDescription: string;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.userInfo();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '600px'
    });
  }

  userInfo() {
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');
    this.userOrg = localStorage.getItem('userOrg');
    this.userRole = localStorage.getItem('userRole');
    if (this.userRole === 'admin') {
      this.isAdmin = true;
      this.roleDescription = `Admin can add more people.Remove a person.Change roles of a person.
      And all rights of a Booker`;
    } else if (this.userRole === 'booker') {
      this.roleDescription = 'Booker can book a room.Add a new room.Remove a room';
    } else if (this.userRole === 'looker') {
      this.roleDescription = 'Looker can see the bookings';
    }
  }

}
