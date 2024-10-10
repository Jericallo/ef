import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { DeleteNewsComponent } from './delete-news/delete-news.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  videoList = []
  columnsToDisplay = ['name', 'duration', 'date','address', 'image', 'acciones'];

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  columnNames = {
    name: 'Nombre',
    duration: 'Duración',
    date:'Fecha',  
    address: 'Video',
    image:'Miniatura',
    acciones: 'Acciones'
  };

  constructor(private apiService: ApiService, private datePipe: DatePipe, public snackBar: MatSnackBar, public dialog: MatDialog) { }

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
    console.log(video)
    const dialogRef = this.dialog.open(DeleteNewsComponent, {
      width: '600px',
      data: { video }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteNews(video.id);
      }
    });
  }

  deleteNews(newsId: number) {
    this.apiService.deleteNews(newsId).subscribe(
      () => {
        this.getPromotionals()
        this.snackBar.open('Noticias borradas correctamente');
      },
      (error) => {
        console.error('Error al eliminar el perfil:', error);
      }
    );
  }

  abrirVideo(link:string){
    window.open(link, '_blank');
  }

}
