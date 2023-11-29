import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatListOption } from '@angular/material/list';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Documentations } from '../../interfaces/documentations-interface';//Services
import { ApiService } from '../../services/api.service';
//Interfaces
import { Documents } from '../../interfaces/documents-interface';
import { ArticleRelation } from '../../interfaces/article-relation-interface';

@Component({
  selector: 'app-search-capacitations',
  templateUrl: './search-capacitations.component.html',
  styleUrls: ['./search-capacitations.component.scss']
})
export class SearchCapacitationsComponent implements OnInit {
  @Output() sendingCapacitations = new EventEmitter<any[]>();
  @Output() closingPanel = new EventEmitter<boolean>();

  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  myControlCapacitations = new FormControl<string | any>('');
  optionsDocuments: any[] = [];
  filteredDocOptions: Observable<any[]> | undefined;

  myControlSearch = new FormControl('');

  selectedDocumentation:any;
  showSpinner = false;
  showMainSpinner = false;
  showResults = false;
  selectedCapacitations = [];
  searchInput: string = "";

  capacitacions: any[] = [];
  documentId: any;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private readonly cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.validateSearch()
  }

  ngAfterViewInit(){
    this.showMainSpinner = true;
    this.apiService.getCapacitationsSinId()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMainSpinner = false;
        this.optionsDocuments = response.result;
        console.log(this.optionsDocuments)
      },
      error: er => {
        console.log(er);
        this.showMainSpinner = false;
        this.snackBar.open('Error al cargar los documentos', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      },
      complete: () => {}
    });
    this.cdRef.detectChanges();
  }

  displayDocuments(doc: any): string {
    return doc && doc.titulo ? doc.titulo : '';
  }
  
  validateSearch(){
    this.showResults = false;
    this.showSpinner = true;
    this.apiService.getCapacitationsSinId()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.capacitacions = response.result;
        console.log(this.capacitacions)
        this.showSpinner = false;
        this.showResults = true;

      },
      error: err => {
        this.showSpinner = false;
        this.showResults = true;
        console.log("Error: ", err);
      }
    })
  }

  onChange(options: any) {
    this.selectedCapacitations = Object.assign(options.map(o => o.value.id));
    console.log(this.selectedCapacitations)
    this.sendingCapacitations.emit(this.selectedCapacitations);
  }

  saveRelation(){
    this.sendingCapacitations.emit(this.selectedCapacitations);
    this.closingPanel.emit(true);
  }

  closePanel(){
    this.closingPanel.emit(true);
  }

  isActiveSearch(){
    if(/*this.searchInput != "" &&*/ this.selectedDocumentation != null){
      return false;
    }else{
      return true;
    }
  }

  isActiveRelation(){
    if(this.selectedCapacitations.length != 0){
      return false;
    } else {
      return true;
    }
  }
}
