import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddProfileDialogComponent } from '../../profiles/add-profile-dialog/add-profile-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import Swal from 'sweetalert2';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit {

  name:String
  length:String
  file:any = null
  image:any = null

  date:String;
  dateDate:Date
  dateForMillis:number
  isDateSelected: boolean = false;

  textButton = 'Guardar'

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddProfileDialogComponent>) { }

  ngOnInit(): void {
  }
  
  addVideo(){
    this.textButton = 'Guardando...'
    const formData = new FormData();
    formData.append('nombre', this.name.toString())
    formData.append('length', 'min5')
    formData.append('category', 'news')
    formData.append('video', this.file)
    formData.append('image', this.image)
    formData.append('date', this.dateForMillis.toString())
    console.log(formData)
    this.apiService.postVideos(formData).subscribe({
      next:res => {
        console.log(res)
        Swal.fire('Guardado exitosamente')
        this.dialogRef.close()
      }, error: (error) => {
        Swal.fire('Ocurrió un error, intente de nuevo más tarde')
        this.textButton = 'Guardar'
      }
    })
    
  }

  seleccionarArchivo(event: any) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      const nombreArchivo = archivoSeleccionado.name;
      if (nombreArchivo.endsWith('.mp4')) {
        this.file = event.target.files[0]
      } else {
        alert('Por favor seleccione un archivo .mp4');
      }
    }
  }

  seleccionarImagen(event: any) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      const nombreArchivo = archivoSeleccionado.name;
      if (nombreArchivo.endsWith('.png') || nombreArchivo.endsWith('.jpg') || nombreArchivo.endsWith('.jpeg')) {
        this.image = event.target.files[0]
      } else {
        alert('Por favor seleccione un archivo .mp4');
      }
    }
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Moment>) {
    this.date = normalizedMonthAndYear.toString()
    this.dateForMillis = normalizedMonthAndYear.getTime()
    datepicker.close();
    this.isDateSelected = true;
  }

  verifyNews():boolean {
    if(this.name !== '' && this.isDateSelected && this.file !== null && this.image !== null){
      return false
    } else {
      return true
    }
  }

}
