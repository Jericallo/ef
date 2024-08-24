import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<number>();
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  myControlCategory = new FormControl('');
  showMain = true;
  showSpinner = false;
  clasification: string | undefined;

  title = "Agregar ley";
  
  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private globalTitle: ApiService) {
    this.globalTitle.updateGlobalTitle(this.title);
  }

  ngOnInit() {
  }

  checkValues() {
    if(this.clasification !== undefined && this.clasification !== '') {
      return false;
    } else {
      return true;
    }
  }

  saveCategory() {
    this.showSpinner = true;
    const body = {
      name:this.clasification
    }
    this.apiService.addLaw(body)
    .subscribe({
      next: response => {
        console.log(response);
        this.showSpinner = false;
        this.snackBar.open('Ley guardada correctamente', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.clasification = undefined;
        this.dataEvent.emit(1)
      },
      error: err => {
        this.showSpinner = false;
        console.log(err)
        this.snackBar.open("Error al agregar la ley", '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    });
  }

}
