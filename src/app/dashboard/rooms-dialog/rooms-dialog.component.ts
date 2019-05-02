import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MatDialog} from '@angular/material';
import { AddRoomComponent } from './add-room/add-room.component';
import { BasicApisService } from '../../services/basic-apis.service';
import { AllRoomRes} from '../../models/allRoomRes';

@Component({
  selector: 'app-rooms-dialog',
  templateUrl: './rooms-dialog.component.html',
  styleUrls: ['./rooms-dialog.component.css']
})
export class RoomsDialogComponent implements OnInit {
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  allRooms: AllRoomRes[];
  selectedRoom: string;
  constructor(public dialogRef: MatDialogRef<RoomsDialogComponent>, private dialog: MatDialog, public basicApi: BasicApisService) { }

  ngOnInit() {
    if (localStorage.getItem('currentRoom')) {
      this.selectedRoom = localStorage.getItem('currentRoom');
    }
    this.showLoader = true;
    this.basicApi.getAllRooms(localStorage.getItem('token'), localStorage.getItem('userOrg'))
    .subscribe(res => {
      this.showLoader = false;
      this.resStatus = 200;
      this.allRooms = res.msg.rooms;
      if (!this.selectedRoom) {
        this.selectedRoom = this.allRooms[0].id;
      }
    }, err => {
      this.showLoader = false;
      const body = JSON.parse(err._body);
      this.resMessage = body.msg;
      this.resStatus = err.status;
    });
  }

  openDialog() {
    this.dialog.open(AddRoomComponent, {
      width: '600px'
    });
    this.dialogRef.close();
  }

}
