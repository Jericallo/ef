import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatListOption } from '@angular/material/list';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Article } from '../../interfaces/article-interface';

//Services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-search-topic',
  templateUrl: './search-topic.component.html',
  styleUrls: ['./search-topic.component.scss']
})
export class SearchTopicComponent implements OnInit {

  @Input() topicsPrevRelated = [];

  @Output() sendingTopics = new EventEmitter<string[]>();
  @Output() closingPanel = new EventEmitter<boolean>();
  @Output() takeTopic = new EventEmitter<number>();

  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  myControlTopics = new FormControl<string | any>('');
  optionsTopics: any[] = [];
  filteredTopicOptions: Observable<any[]> | undefined;

  myControlSearch = new FormControl('');

  selectedTop = null;
  showSpinner = false;
  showMainSpinner = false;
  showResults = false;
  selectedTopicOptions = [];
  searchInput: string = "";

  topics = [];
  topicId = null;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private readonly cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.filteredTopicOptions = this.myControlTopics.valueChanges.pipe(
      startWith(''),debounceTime(300),
      map(value => {
        console.log('VALOR',value)
        const name = typeof value === 'string' ? value : value?.titulo;
        return name ? this._filterDoc(name as string) : this.optionsTopics.slice();
      }),
    );
  }

  ngAfterViewInit(){
    this.getTopics()
    this.cdRef.detectChanges();
  }

  getTopics(){
    this.apiService.getTopics()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response)
        let purosTemas = []
        response.result.forEach(element => {
          element.palabras.forEach(element2 => {
            purosTemas.push(element2)
          })
        });
        this.optionsTopics = purosTemas
        console.log(this.optionsTopics)

      },
      error: er => {
        console.log(er);
        this.snackBar.open('Error al cargar los temas', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      },
      complete: () => {}
    });
  }
  private _filterDoc(doc: string): any[] {
    const filterValueDoc = doc.toLowerCase();
    console.log(this.optionsTopics)
    return this.optionsTopics.filter(option => option.nombre.toLowerCase().includes(filterValueDoc));
  }

  displayDocuments(doc: any): string {
    return doc;
  }

  selectedTopic(opt: MatAutocompleteSelectedEvent) {
    console.log(opt.option)
    this.selectedTop = opt.option.value;
    console.log(this.optionsTopics)
    this.optionsTopics.forEach((element) => {
      if(element.nombre === opt.option.value){
        this.topicId = element.id;
      }
    })
    console.log(this.topicId)
  }

  handleEmptyTopic(event: any){
    event.target.value === '' ? this.selectedTopic = null : "";
  }

  onChange(options: MatListOption[]) {
    console.log('a')
    this.selectedTopicOptions = Object.assign(options.map(o => o.value));
  }

  saveRelation(){
    this.sendingTopics.emit([this.topicId]);
    this.closingPanel.emit(true);
  }

  closePanel(){
    this.closingPanel.emit(true);
  }

  isActiveSearch(){
    if(/*this.searchInput != "" &&*/ this.selectedTopic != null){
      return false;
    }else{
      return true;
    }
  }

  isActiveRelation(){
    if(this.topicId !== null){
      return false;
    } else {
      return true;
    }
  }

  deleteTopic(id:number, index:number) {
    this.takeTopic.emit(id)

    this.topicsPrevRelated.splice(index,1)
  }

}
