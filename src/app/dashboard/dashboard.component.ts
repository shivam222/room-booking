import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { RoomsDialogComponent } from './rooms-dialog/rooms-dialog.component';
import { BasicApisService } from '../services/basic-apis.service';
import { AllRoomRes} from '../models/allRoomRes';
import { SingleRoom} from '../models/singleRoom';
import { timer } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedDate: Date;
  selectedRoom: string;
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  allRooms: AllRoomRes[];
  selectedRoomDetails: SingleRoom;
  constructor(private dialog: MatDialog, private basicApi: BasicApisService) { }

  ngOnInit() {
    this.selectedDate = new Date();
    timer(0, 15000)
    .subscribe( val => {
    this.basicApi.getAllRooms(localStorage.getItem('token'), localStorage.getItem('userOrg'))
    .subscribe(res => {
      this.showLoader = false;
      this.resStatus = 200;
      this.allRooms = res.msg.rooms;
      console.log(this.allRooms);
      if (localStorage.getItem('currentRoom')) {
        this.selectedRoom = localStorage.getItem('currentRoom');
        this.getRoomDetails();
      } else {
        this.selectedRoom = this.allRooms[0].id;
        this.getRoomDetails();
        localStorage.setItem('currentRoom', this.selectedRoom);
      }
    }, err => {
      this.showLoader = false;
      const body = JSON.parse(err._body);
      this.resMessage = body.msg;
      this.resStatus = err.status;
    });
  });
  }

  onSelect(event) {
    this.selectedDate = event;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RoomsDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== '' && result !== undefined && result !== null) {
         this.selectedRoom = result;
         this.getRoomDetails();
         localStorage.setItem('currentRoom', this.selectedRoom);
      }
    });
 }

  getRoomDetails() {
    const self = this;
    this.allRooms.forEach(function(item, index) {
      if (item.id === self.selectedRoom) {
        console.log(item);
        self.selectedRoomDetails = item;
      }
    });
  }

  newBooking(value) {
    console.log(value);
  }
}
