import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatListOption } from '@angular/material/list';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Article } from '../../interfaces/article-interface';

//Services
import { ApiService } from '../../services/api.service';
//Interfaces
import { Documents } from '../../interfaces/documents-interface';
import { ArticleRelation } from '../../interfaces/article-relation-interface';

@Component({
  selector: 'app-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.css']
})
export class SearchDocumentComponent implements OnInit {

  @Output() sendingArticles = new EventEmitter<string[]>();
  @Output() closingPanel = new EventEmitter<boolean>();

  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  myControlDocuments = new FormControl<string | Documents>('');
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;

  myControlSearch = new FormControl('');

  selectedDocument = null;
  showSpinner = false;
  showMainSpinner = false;
  showResults = false;
  selectedArtOptions = [];
  searchInput: string = "";

  articles: ArticleRelation[] = [];
  documentId: any;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private readonly cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.filteredDocOptions = this.myControlDocuments.valueChanges.pipe(
      startWith(''),debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.titulo;
        return name ? this._filterDoc(name as string) : this.optionsDocuments.slice();
      }),
    );
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

  selectedDoc(opt: MatAutocompleteSelectedEvent) {
    this.selectedDocument = opt.option.value.titulo;
    this.documentId = opt.option.value.id;
  }

  handleEmptyDoc(event: any){
    event.target.value === '' ? this.selectedDocument = null : "";
  }

  validateSearch(){
    this.showResults = false;
    this.showSpinner = true;
    this.apiService.searchArticle(this.documentId, this.searchInput)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response)
        let articulosLimpios:ArticleRelation[] = []

        //Prepare yourself for the ugliest piece of code you'll ever see :)

        if('result' in response){ //Checks if the response array is empty
          if('documentos' in response.result[0]){ //Checks if there's a tag 'documentos' inside of the response (there should always be)
            response.result[0].documentos.forEach(documentos => { //There can be many documents. This reads each one
              console.log(documentos)
              if('capitulos' in documentos && documentos.capitulos != null){ //Checks if there's a tag 'capitulos' inside of the response
                documentos.capitulos.forEach(documentosCapitulos => { //There can be many chapters. This reads each one
                  if ('seccion' in documentosCapitulos && documentosCapitulos.seccion != null){ //Checks if there's a tag 'seccion' inside of the chapters
                    documentosCapitulos.seccion.forEach(documentosCapitulosSeccion => { //There can be many sections. This reads each one
                      //Adds all articles
                      if('articulos' in documentosCapitulosSeccion && documentosCapitulosSeccion.articulos != null){
                        documentosCapitulosSeccion.articulos.forEach(documentosCapitulosSeccionArticulo => {
                          articulosLimpios.push(documentosCapitulosSeccionArticulo)
                        });
                      }
                    })
                  } else { //If there are no sections in the chapter, it still tries to add the articles, if there are
                    //Adds all articles
                    if('articulos' in documentosCapitulos && documentosCapitulos.articulos != null){
                      documentosCapitulos.articulos.forEach(documentosCapitulosArticulo => {
                        articulosLimpios.push(documentosCapitulosArticulo)
                      });
                    }
                  }
                });
              }else if ('seccion' in documentos && documentos.seccion != null){ //Checks if there's a tag 'seccion' inside of the documents
                documentos.seccion.forEach(documentoSeccion => { //There can be many sections. This reads each one
                  //Adds all articles
                  if('articulos' in documentoSeccion && documentoSeccion.articulos != null){
                    documentoSeccion.articulos.forEach(documentoSeccionArticulo => {
                      articulosLimpios.push(documentoSeccionArticulo)
                    });
                  }
                })
              }else if ('titulos' in documentos && documentos.titulos != null){ //Checks if there's a tag 'titulo' inside of the documents
                documentos.titulos.forEach(documentoTitulo => { //There can be many titles. This reads each one
                  if('seccion' in documentoTitulo && documentoTitulo.seccion != null){ //Checks if there's a tag 'seccion' inside of the title
                    documentoTitulo.articulos.forEach(documentoTituloSeccion => { //There can be many sections. This reads each one
                      //Adds all articles
                      if('articulos' in documentoTituloSeccion && documentoTituloSeccion.articulos != null){
                        documentoTituloSeccion.articulos.forEach(documentoTituloSeccionArticulo => {
                          articulosLimpios.push(documentoTituloSeccionArticulo)
                        })
                      }
                    });
                  } else { //If there are no sections in the title, it still tries to add the articles, if there are
                    //Adds all articles
                    if('articulos' in documentoTitulo && documentoTitulo.articulos != null){
                      documentoTitulo.articulos.forEach(documentoTituloArticulo => {
                        articulosLimpios.push(documentoTituloArticulo)
                      })
                    }
                  }
                })
              } else {
                if('articulos' in documentos){
                  documentos.articulos.forEach(documentoArticulo => {
                    articulosLimpios.push(documentoArticulo)
                  });
                }
              }
            });
          }
        }
      
        this.showSpinner = false;
        this.showResults = true;
        this.articles = articulosLimpios;
      },
      error: err => {
        this.showSpinner = false;
        this.showResults = true;
        console.log("Error: ", err);
      }
    })
  }

  onChange(options: MatListOption[]) {
    this.selectedArtOptions = Object.assign(options.map(o => o.value));
  }

  saveRelation(){
    this.sendingArticles.emit(this.selectedArtOptions);
    this.closingPanel.emit(true);
  }

  closePanel(){
    this.closingPanel.emit(true);
  }

  isActiveSearch(){
    if(/*this.searchInput != "" &&*/ this.selectedDocument != null){
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
