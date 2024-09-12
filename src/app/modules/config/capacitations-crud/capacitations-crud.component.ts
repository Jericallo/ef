import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddCapacitationsComponent } from './add-capacitations/add-capacitations.component';
import Swal from 'sweetalert2';
import { AssignVideoComponent } from './assign-video/assign-video.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capacitations-crud',
  templateUrl: './capacitations-crud.component.html',
  styleUrls: ['./capacitations-crud.component.scss']
})
export class CapacitationsCrudComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  dataSource = [
    {nombre:'PepsiCo', razon_social:'No sé', rfc:'AB12393JDF1', codigo_postal:'45050', regimen_fiscal:'No sé pt.2', trabaja_sabados:1, estatus:1}
  ]

  capacitaciones = null

  columnsToDisplay = ['titulo', 'descripcion','tiempo_limite', 'media', 'preguntas', 'acciones'];

  columnNames = {
    titulo: 'Título',
    descripcion: 'Descripción',     
    tiempo_limite: 'Tiempo limite',
    media:'Media',
    preguntas: 'Cuestionario',
    acciones:'Acciones'
  };


  constructor(private apiService: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar, private router: Router ) { }

  ngOnInit(): void {
    this.getCapacitaciones()
  }

  getCapacitaciones(){
    this.apiService.getCapacitations().subscribe({
      next:res => {
        this.dataSource = res
        console.log(res, this.dataSource)
        this.capacitaciones = res
      }
    })
  }

  deleteCapacitation(capacitationId: number) {
    Swal.fire({
      title: "¿Seguro que desea borrar la capacitación?",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton:false,
      denyButtonText: `Borrar`,
      cancelButtonText:'Cancelar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        this.apiService.deleteCapacitation(capacitationId).subscribe({
          next:res => {
            console.log(res)
            //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
            this.getCapacitaciones()
            this.snackBar.open('Capacitación borrada exitosamente', '', this.config_snack);
          }
        })
      } 
    });
  }

  openAdd(){
    console.log({ capacitations:this.capacitaciones })
    const dialogRef = this.dialog.open(AddCapacitationsComponent, {
      width: '1000px',
      data: { capacitations:this.capacitaciones }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCapacitaciones()
    });
  }

  openAssign(id:number){
    console.log({ capacitations:this.capacitaciones })
    const dialogRef = this.dialog.open(AssignVideoComponent, {
      width: '600px',
      data: { capacitation:id }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCapacitaciones()
    });
  }

  // openEdit(company: any) {
  //   const dialogRef = this.dialog.open(EditCompanyDialogComponent, {
  //     width: '1000px',
  //     data: { company } 
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //       this.getCapacitaciones();
  //   });
  // }
  calculadorDeNivel(row:any){
    let nivel = ''
    if(row.nivel_1 > 0) nivel = nivel + row.nivel_1.toString()
    if(row.nivel_2 > 0) nivel = nivel + '.' + row.nivel_2.toString()
    if(row.nivel_3 > 0) nivel = nivel + '.' + row.nivel_3.toString()

    return nivel
  }

  abrirVideo(link:string){
    window.open(`https://apiefv3.globalbusiness.com.mx/src/uploads/videos/${link}`, '_blank');
  }

  abrirImagen(link:string){
    window.open(`https://apiefv3.globalbusiness.com.mx/src/uploads/images/${link}`, '_blank');
  }
  
  openQuestions(id:number){
    console.log(id)
    this.router.navigate(['config/questionarie'], {
      state: {
        id:id
      }
    })
  }
}
