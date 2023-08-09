import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-module-dialog',
  templateUrl: './remove-module-dialog.component.html',
  styleUrls: ['./remove-module-dialog.component.scss']
})
export class RemoveModuleDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveModuleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRef.close();
  }

}
