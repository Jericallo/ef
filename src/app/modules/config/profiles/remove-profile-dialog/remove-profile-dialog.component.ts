import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-profile-dialog',
  templateUrl: './remove-profile-dialog.component.html',
  styleUrls: ['./remove-profile-dialog.component.scss']
})
export class RemoveProfileDialogComponent implements OnInit {
  

  constructor(public dialogRef: MatDialogRef<RemoveProfileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

  }

  cancel(){
    this.dialogRef.close();
  }

}
