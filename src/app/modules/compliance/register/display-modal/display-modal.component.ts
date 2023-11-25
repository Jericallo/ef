import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-display-modal',
  templateUrl: './display-modal.component.html',
  styleUrls: ['./display-modal.component.scss']
})
export class DisplayModalComponent implements OnInit {
  objectProperties = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.objectProperties = data
  }

  ngOnInit(): void {
  }

}
