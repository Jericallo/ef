import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  title = "Agregar Libro a la Ley";
  showSpinner = false;

  verticalPosition: MatSnackBarVerticalPosition = 'top';

  selectedLaw: string = '';
  laws:any

  name = ''
  number = ''

  constructor(public apiService: ApiService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getLaws()
  }

  getLaws():void {
    this.apiService.getLeyes().subscribe({
      next: res => {
        this.laws = res
      }, error: err => {
        this.snackBar.open('Ocurrió un error al recuperar las leyes', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    })
  }

  saveAssignation(){
    const body = {
      lawId: this.selectedLaw,
      name: this.name, 
      number: this.number
    }
    console.log(body)
    this.apiService.addBook(body).subscribe({
      next: res => {
        this.snackBar.open('Libro guardado correctamente', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al guardar el libro', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    })
  }

  checkValues() {
    const numberRegex = /^\d+$/; 
    if(this.name === ''){
      return true
    }
    if(this.selectedLaw === '') {
      return true
    }
    if(this.number === '' || !numberRegex.test(this.number)) {
      return true
    }

    return false
  }

  setLaw(value:string){
    this.selectedLaw = value
  }

  changeName(value:string) {
    this.name = value
  }

  changeNumber(value:string) {
    this.number = value.toString()
  }
}