import { ForgotPasswordService } from './../../services/forgot-password.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  showLoader: boolean;
  resMessage: string;
  resStatus: number;
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>, private passService: ForgotPasswordService) { }

  ngOnInit() {
  }

  change(value) {
    this.showLoader = true;
    this.passService.changePass(value, localStorage.getItem('token'), localStorage.getItem('userEmail'))
    .subscribe(res => {
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

  close() {
    this.dialogRef.close();
  }

}
