import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedDate: Date;
  constructor() { }

  ngOnInit() {
    this.selectedDate = new Date();
  }
  onSelect(event){
    console.log(event);
    this.selectedDate = event;
  }
  sample() {
    console.log(this.selectedDate);
  }
}