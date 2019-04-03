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
  selectedDate: any;
  selectedRoom: string;
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  allRooms: AllRoomRes[];
  selectedRoomDetails: SingleRoom;
  selectedRoomName: string;
  selectedRoomDateBooking: any; // FIXME: strict type check
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
    this.selectedDate = new Date(event);
  }

  toIso(sampleDate) {
     sampleDate.setHours(0, -sampleDate.getTimezoneOffset(), 0, 0);
     this.selectedDate = sampleDate.toISOString();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RoomsDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== '' && result !== undefined && result !== null) {
         this.selectedRoom = result;
         this.getRoomDetails();
         localStorage.setItem('currentRoom', this.selectedRoom);
      }
    });
 }

  getRoomDetails() {
    const self = this;
    this.allRooms.forEach(function(item) {
      if (item.id === self.selectedRoom) {
        console.log(item.bookings);
        console.log(item.name);
        self.toIso(new Date(self.selectedDate));
        console.log(self.selectedDate);
        self.selectedDate = self.selectedDate.substring(0, 10);
        self.selectedRoomName = item.name;
        self.selectedRoomDateBooking = item.bookings[self.selectedDate];
        self.selectedRoomDetails = item;
      }
    });
  }

  newBooking(value) {
    this.basicApi.newBooking(this.selectedRoom, this.selectedDate, value,
    localStorage.getItem('userOrg'), localStorage.getItem('token'),
    localStorage.getItem('userName'))
    .subscribe(res => {

    }, err => {

    });
  }
}
