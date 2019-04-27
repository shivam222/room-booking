import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.css']
})
export class ChangeRoleComponent implements OnInit {

  constructor(private adminService: AdminService,
    public dialogRef: MatDialogRef<ChangeRoleComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

  role1: string;
  role2: string;
  showLoader: boolean;
  resMessage: string;
  resStatus: number;
  ngOnInit() {
    if (this.data.role === 'booker') {
      this.role1 = 'looker';
      this.role2 = 'admin';
    } else if (this.data.role === 'admin') {
      this.role1 = 'booker';
      this.role2 = 'looker';
    } else if (this.data.role === 'looker') {
      this.role1 = 'booker';
      this.role2 = 'admin';
    }
  }

  change(value) {
    if (value.role === 'looker' || value.role === 'booker' || value.role === 'admin') {
    this.showLoader = true;
    this.adminService.changeRole(localStorage.getItem('token'), this.data.email, value.role)
    .subscribe( res => {
      this.showLoader = false;
      this.resMessage = res.msg;
      this.resStatus = 200;
    }, err => {
      this.showLoader = false;
      const body = JSON.parse(err._body);
      this.resMessage = body.msg;
      this.resStatus = err.status;
    });
  }
  }

  close() {
    this.dialogRef.close();
  }

}
