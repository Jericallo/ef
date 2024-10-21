import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RemoveProfileDialogComponent } from '../../profiles/remove-profile-dialog/remove-profile-dialog.component';

@Component({
  selector: 'app-delete-news',
  templateUrl: './delete-news.component.html',
  styleUrls: ['./delete-news.component.scss']
})
export class DeleteNewsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveProfileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRef.close();
  }
}
