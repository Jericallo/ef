import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddCapacitationsVideosComponent } from './add-capacitations-videos/add-capacitations-videos.component';
import { DeleteCapacitationsVideosComponent } from './delete-capacitations-videos/delete-capacitations-videos.component';

@Component({
  selector: 'app-capacitations-videos',
  templateUrl: './capacitations-videos.component.html',
  styleUrls: ['./capacitations-videos.component.scss']
})
export class CapacitationsVideosComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  videoList = []
  columnsToDisplay = ['name', 'duration', 'address', 'image', 'acciones'];

  columnNames = {
    name: 'Nombre',
    duration: 'Duración',
    address: 'Video',
    image:'Miniatura',
    acciones: 'Acciones'
  };

  constructor(private apiService: ApiService, private datePipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPromotionals()
  }

  getPromotionals(){
    this.apiService.getVideos('trainning').subscribe({
      next:res => {
        console.log(res)
        this.videoList = res.result;
        this.dataSource = new MatTableDataSource<any>(this.videoList);
      }
    })
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddCapacitationsVideosComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPromotionals()
    });
  }

  openRemove(video:any) {
    const dialogRef = this.dialog.open(DeleteCapacitationsVideosComponent, {
      width: '600px',
      data: { video }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPromotionals()
    });
  }

  abrirVideo(link:string){
    window.open(link, '_blank');
  }
}