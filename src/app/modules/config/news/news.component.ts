import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { DeleteNewsComponent } from './delete-news/delete-news.component';
import { AddNewsComponent } from './add-news/add-news.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  videoList = []
  columnsToDisplay = ['name', 'duration', 'date','address', 'image', 'acciones'];

  columnNames = {
    name: 'Nombre',
    duration: 'Duración',
    date:'Fecha',  
    address: 'Video',
    image:'Miniatura',
    acciones: 'Acciones'
  };

  constructor(private apiService: ApiService, private datePipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPromotionals()
  }

  getPromotionals(){
    this.apiService.getVideos('news').subscribe({
      next:res => {
        console.log(res)
        this.videoList = res.result;
        this.dataSource = new MatTableDataSource<any>(this.videoList);
      }
    })
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddNewsComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPromotionals()
    });
  }

  openRemove(video:any) {
    const dialogRef = this.dialog.open(DeleteNewsComponent, {
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
