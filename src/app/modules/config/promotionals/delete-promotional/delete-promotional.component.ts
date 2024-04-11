import { Component, Inject, OnInit } from '@angular/core';
import { RemoveProfileDialogComponent } from '../../profiles/remove-profile-dialog/remove-profile-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-delete-promotional',
  templateUrl: './delete-promotional.component.html',
  styleUrls: ['./delete-promotional.component.scss']
})
export class DeletePromotionalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveProfileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public apiService: ApiService) { }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRef.close();
  }

  delete(){
    const body = {
      id:this.data.video.id
    }
    console.log(body)
    this.apiService.deleteVideos(body).subscribe({
      next:res => {
        console.log(res)
        this.dialogRef.close();
      }
    })
  }
}