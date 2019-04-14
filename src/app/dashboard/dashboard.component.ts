import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog} from '@angular/material';
import { RoomsDialogComponent } from './rooms-dialog/rooms-dialog.component';
import { BasicApisService } from '../services/basic-apis.service';
import { AllRoomRes} from '../models/allRoomRes';
import { SingleRoom} from '../models/singleRoom';
import { timer, Subscription } from 'rxjs';
import swal from 'sweetalert';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy  {
  selectedDate: any;
  selectedRoom: string;
  resMessage: string;
  resStatus: number;
  showLoader: boolean;
  showLoader2: boolean;
  allRooms: AllRoomRes[];
  selectedRoomDetails: SingleRoom;
  selectedRoomName: string;
  selectedRoomDateBooking: any; // FIXME: strict type check
  noRoom: boolean;
  constructor(private dialog: MatDialog, private basicApi: BasicApisService) { }
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;

  ngOnInit() {
    this.showLoader = true;
    if (localStorage.getItem('currentDate')) {
      this.selectedDate = localStorage.getItem('currentDate');
    } else {
      this.selectedDate = new Date();
    }
    this.getBookingTimer();
  }

  onSelect(event) {
    this.selectedDate = new Date(event);
    localStorage.setItem('currentDate', this.selectedDate);
    this.getRoomDetails();
  }

  onSelectSmall() {
    localStorage.setItem('currentDate', this.selectedDate);
    this.getRoomDetails();
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
        if (result.startsWith('delete')) {
          const roomId = result.split('delete');
          if (this.allRooms.length === 1) {
            this.noRoom = true;
            this.selectedRoom = '';
            localStorage.removeItem('currentRoom');
          } else if (roomId[1] === this.selectedRoom) {
            this.selectedRoom = roomId[1] === this.allRooms[0].id ? this.allRooms[1].id : this.allRooms[0].id;
            this.getRoomDetails();
            localStorage.setItem('currentRoom', this.selectedRoom);
          }
          this.basicApi.deleteRoom(localStorage.getItem('token'), roomId[1])
          .subscribe(res => {
            swal(res.msg);
          }, err => {
            const body = JSON.parse(err._body);
            swal(body.msg);
          });
        } else {
          this.noRoom = false;
          this.selectedRoom = result;
          this.getRoomDetails();
          localStorage.setItem('currentRoom', this.selectedRoom);
        }
      }
    });
 }

  getRoomDetails() {
    const self = this;
    this.allRooms.forEach(function(item) {
      if (item.id === self.selectedRoom) {
        self.toIso(new Date(self.selectedDate));
        self.selectedDate = self.selectedDate.substring(0, 10);
        self.selectedRoomName = item.name;
        if (item.hasOwnProperty('bookings') && item.bookings.hasOwnProperty(self.selectedDate)) {
          self.selectedRoomDateBooking = item.bookings[self.selectedDate];
        } else {
          self.selectedRoomDateBooking = [];
        }
        self.selectedRoomDetails = item;
      }
    });
  }

  newBooking(value) {
    this.showLoader2 = true;
    this.basicApi.newBooking(this.selectedRoom, this.selectedDate, value,
    localStorage.getItem('userOrg'), localStorage.getItem('token'),
    localStorage.getItem('userName'))
    .subscribe(res => {
        this.getBooking();
        this.showLoader2 = false;
        swal(res.msg);
    }, err => {
        this.showLoader2 = false;
        const body = JSON.parse(err._body);
        swal(body.msg);
    });
  }

  deleteBooking(bookingData) {
    this.subscription3 = this.basicApi.deleteRoomBooking(this.selectedRoom, this.selectedDate, bookingData, localStorage.getItem('token'))
    .subscribe(res => {
      this.getBooking();
      swal(res.msg);
    }, err => {
      const body = JSON.parse(err._body);
      swal(body.msg);
    });
  }

  getBookingTimer(): any {
    this.subscription1 = timer(0, 15000)
    .subscribe( val => {
    this.getBooking();
  });
  }

  getBooking(): any {
    this.subscription2 = this.basicApi.getAllRooms(localStorage.getItem('token'), localStorage.getItem('userOrg'))
    .subscribe(res => {
      this.showLoader = false;
      this.resStatus = 200;
      this.allRooms = res.msg.rooms;
      if (localStorage.getItem('currentRoom')) {
        this.selectedRoom = localStorage.getItem('currentRoom');
        this.getRoomDetails();
      } else {
        if (this.allRooms.length > 0) {
        this.noRoom = false;
        this.selectedRoom = this.allRooms[0].id;
        this.getRoomDetails();
        localStorage.setItem('currentRoom', this.selectedRoom);
        } else {
          this.noRoom = true;
          localStorage.removeItem('currentRoom');
        }
      }
    }, err => {
      this.noRoom = true;
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
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
    if (this.subscription3) {
      this.subscription3.unsubscribe();
    }
  }
}
