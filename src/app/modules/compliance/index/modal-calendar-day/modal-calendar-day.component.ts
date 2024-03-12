import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-calendar-day',
  templateUrl: './modal-calendar-day.component.html',
  styleUrls: ['./modal-calendar-day.component.scss']
})
export class ModalCalendarDayComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
  }

}
