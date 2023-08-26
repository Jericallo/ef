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
  selector: 'app-search-documentation',
  templateUrl: './search-documentation.component.html',
  styleUrls: ['./search-documentation.component.scss']
})
export class SearchDocumentationComponent implements OnInit {
  @Output() sendingDocumentations = new EventEmitter<any[]>();
  @Output() closingPanel = new EventEmitter<boolean>();

  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  myControlDocuments = new FormControl<string | Documents>('');
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;

  myControlSearch = new FormControl('');

  selectedDocumentation:any;
  showSpinner = false;
  showMainSpinner = false;
  showResults = false;
  selectedArtOptions = [];
  searchInput: string = "";

  documentations: Documentations[] = [];
  documentId: any;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private readonly cdRef: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.validateSearch()
    
  }

  ngAfterViewInit(){
    this.showMainSpinner = true;
    this.apiService.getDocuments()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMainSpinner = false;
        this.optionsDocuments = response.result;
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

  private _filterDoc(doc: string): Documents[] {
    const filterValueDoc = doc.toLowerCase();
    return this.optionsDocuments.filter(option => option.titulo.toLowerCase().includes(filterValueDoc));
  }

  displayDocuments(doc: Documents): string {
    return doc && doc.titulo ? doc.titulo : '';
  }
  
  validateSearch(){
    this.showResults = false;
    this.showSpinner = true;
    this.apiService.getDocumentations()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response)
        let articulosLimpios:Documentations[] = []
        response.result.forEach((element) => {
          articulosLimpios.push(element)
        })
      
        this.showSpinner = false;
        this.showResults = true;
        this.documentations = articulosLimpios;
      },
      error: err => {
        this.showSpinner = false;
        this.showResults = true;
        console.log("Error: ", err);
      }
    })
  }

  onChange(options: any) {
    this.selectedArtOptions = Object.assign(options.map(o => o.value.id));
    console.log(this.selectedArtOptions)
    this.sendingDocumentations.emit(this.selectedArtOptions);
  }

  saveRelation(){
    this.sendingDocumentations.emit(this.selectedArtOptions);
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
    if(this.selectedArtOptions.length != 0){
      return false;
    } else {
      return true;
    }
  }
}
