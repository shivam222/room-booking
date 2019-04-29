import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import {MatDialog} from '@angular/material';
import { ChangeRoleComponent } from './change-role/change-role.component';
import { Subscription } from 'rxjs';
import swal from 'sweetalert';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit, OnDestroy {

  users: any[]; // FIXME:
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  constructor(private adminService: AdminService, private dialog: MatDialog) { }
  private subscription1: Subscription;
  private subscription2: Subscription;

  ngOnInit() {
   this.showLoader = true;
   this.subscription1 = this.adminService.allUsers(localStorage.getItem('token'), localStorage.getItem('userOrg'))
   .subscribe(res => {
    this.showLoader = false;
     this.users = res.msg;
     this.resStatus = 200;
   }, err => {
    this.showLoader = false;
    const body = JSON.parse(err._body);
    this.resMessage = body.msg;
    this.resStatus = err.status;
   });
  }

  ngOnDestroy() {
    if (this.subscription1) {
    this.subscription1.unsubscribe();
    }
  }

  deleteUser(userEmail) {
    const sure = confirm('Are You Sure you want to remove ' + userEmail);
    if (sure && userEmail !== localStorage.getItem('userEmail')) {
      this.subscription1 = this.adminService.deleteUser(localStorage.getItem('token'), userEmail)
      .subscribe(res => {
        swal(res.msg);
      }, err => {
        const body = JSON.parse(err._body);
        swal(body.msg);
      });
    } else if (userEmail === localStorage.getItem('userEmail')) {
       swal('Sorry!You can not delete yourself');
    }
  }

  changeRole(userEmail, userRole) {
    this.openDialog(userEmail, userRole);
  }

  openDialog(email, role): void {
    this.dialog.open(ChangeRoleComponent, {
      width: '600px',
      data: {email, role}
    });
 }
}
