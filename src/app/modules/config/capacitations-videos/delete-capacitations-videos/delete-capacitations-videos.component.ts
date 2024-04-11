import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-delete-capacitations-videos',
  templateUrl: './delete-capacitations-videos.component.html',
  styleUrls: ['./delete-capacitations-videos.component.scss']
})
export class DeleteCapacitationsVideosComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteCapacitationsVideosComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public apiService: ApiService) { }

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
