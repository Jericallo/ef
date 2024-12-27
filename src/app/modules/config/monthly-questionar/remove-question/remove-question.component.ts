import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-question',
  templateUrl: './remove-question.component.html',
  styleUrls: ['./remove-question.component.scss']
})
export class RemoveQuestionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
