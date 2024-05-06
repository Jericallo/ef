import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddPromotionalComponent } from './add-promotional/add-promotional.component';
import { DeletePromotionalComponent } from './delete-promotional/delete-promotional.component';

@Component({
  selector: 'app-promotionals',
  templateUrl: './promotionals.component.html',
  styleUrls: ['./promotionals.component.scss']
})
export class PromotionalsComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  videoList = []
  columnsToDisplay = ['name', 'address', 'acciones'];

  columnNames = {
    name: 'Nombre',
    address: 'Video',
    acciones: 'Acciones'
  };

  constructor(private apiService: ApiService, private datePipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPromotionals()
  }

  getPromotionals(){
    this.apiService.getVideos('promotional').subscribe({
      next:res => {
        console.log(res)
        this.videoList = res.result;
        this.dataSource = new MatTableDataSource<any>(this.videoList);
      }
    })
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddPromotionalComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPromotionals()
    });
  }

  openRemove(video:any) {
    const dialogRef = this.dialog.open(DeletePromotionalComponent, {
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
