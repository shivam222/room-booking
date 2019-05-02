import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { BasicApisService } from '../../../services/basic-apis.service';


@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  room: string;
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  constructor(public dialogRef: MatDialogRef<AddRoomComponent>, public basicApi: BasicApisService) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  create(value) {
   this.showLoader = true;
   this.basicApi.addRoom(localStorage.getItem('token'), localStorage.getItem('userOrg'), value.room)
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
}
