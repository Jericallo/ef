import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  classifications: any[] = [];
  selectedNombre: string = '';
  selectedDocId: number | undefined;
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;
  showMain = true;

  constructor(private apiService: ApiService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getClassifications();
  }

  setDoc(doc) {
    this.selectedNombre = doc.name;
    this.selectedDocId = doc.id; 
    console.log(this.selectedNombre);
  }

  getClassifications() {
    this.showSpinner = true
    this.showMain = false
    this.apiService.getLeyes().subscribe({
      next: response => {
        this.showSpinner = false
        this.showMain = true
        this.classifications = response;
        console.log(this.classifications);
      },
      error: err => {
        console.error('Error fetching classifications:', err);
      }
    });
  }

  checkValues() {
    return !(this.selectedDocId !== 0 && this.selectedDocId !== undefined)
  }

  saveCategory() {
    const expresionRegular = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    const inputValue = this.selectedNombre; 
    if(expresionRegular.test(inputValue)){
      this.snackBar.open('No se permiten caracteres especiales', '', { 
        duration: 3000,
        verticalPosition: this.verticalPosition
      });
      return
    }
    if (this.selectedDocId) {
      const body = {
        name: inputValue
      }
      console.log(body)
      this.apiService.editLaw(body, this.selectedDocId).subscribe({
        next: response => {
          this.getClassifications()
          this.snackBar.open('Ley actualizada.', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
          this.resetInputs();
        },
        error: err => {
          this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })        
        }
      });
    }else{
      this.snackBar.open('Debes seleccionar una Ley', '', {
        duration:3000,
        verticalPosition:this.verticalPosition
      })        
    }
  }

  deleteCategory() {
    if (this.selectedDocId) {

      this.apiService.deleteLaw(this.selectedDocId).subscribe({
        next: response => {
          this.getClassifications()
        },
        error: err => {
          this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })        
          this.resetInputs(); 
        }
      });
    }else{
      this.snackBar.open('Debes seleccionar una Ley', '', {
        duration:3000,
        verticalPosition:this.verticalPosition
      })        
    }
  }

  resetInputs() {
    this.selectedNombre = '';
    this.selectedDocId = undefined;
  }
}
