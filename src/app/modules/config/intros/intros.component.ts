import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { EditIntrosComponent } from './edit-intros/edit-intros.component';

@Component({
  selector: 'app-intros',
  templateUrl: './intros.component.html',
  styleUrls: ['./intros.component.scss']
})
export class IntrosComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  videoList = []
  columnsToDisplay = ['name', 'duration','address', 'image', 'acciones'];

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
    this.apiService.getVideos('intro').subscribe({
      next:res => {
        console.log(res)
        this.videoList = res.result;
        this.dataSource = new MatTableDataSource<any>(this.videoList);
      }
    })
  }

  openEdit(video:any) {
    const dialogRef = this.dialog.open(EditIntrosComponent, {
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
