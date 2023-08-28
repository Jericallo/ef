import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers:[ApiService]
})
export class SearchComponent{
  input: any;
  public keyword = "nombre";
  data = [];
  articlesFull = [];
  firstShow = true;

  clasificaciones=[];
  article=null;
  articles=[];
  articleRel = null;

/*
  constructor(private dataSvc:ApiService){}

    ngOnInit(): void {
      this.getData();
    }

  getData(): void{
    //this.dataSvc.getAll().subscribe(console.log);
     this.dataSvc.getSearch().subscribe({
      next:res=>{
        res = JSON.parse(this.dataSvc.decrypt(res.message,this.dataSvc.getPrivateKey()))
        console.log(res)
        this.data = res
      }
    });
  }
*/

constructor(private apiService:ApiService, private router: Router){}
  ngOnInit(): void {this.get(); this,this.getAll();}

private get(){
  this.apiService.getAll(this.apiService.MODELS.topics).subscribe({
    next:(res)=>{
      try {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        console.log(res)
        res.result.forEach(res =>{
          this.data.push(res.palabras);
        })
        this.data = this.data.flat(1);
      } catch (error) {
        console.log(error)
      }
    },
    error:()=>{}
  });
}

private getAll(){
  this.apiService.getAll(this.apiService.MODELS.articles).subscribe({
    next:(res)=>{
      try {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        console.log(res)
        res.result.forEach(res =>{
          this.articlesFull.push(res);
        })
        console.log(this.articlesFull)
      } catch (error) {
        console.log(error)
      }
    },
    error:()=>{}
  });
}

public response(){
 // var input = document.querySelector('.ng-autocomplete input') as HTMLInputElement | null;
 // var inputValue = input?.value
 this.clasificaciones = [];
  this.apiService.content('articulos',(this.input.nombre ? this.input.nombre : this.input)).subscribe({
    next:(res)=>{
      try{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        console.log(res)
        res.result.forEach(res =>{
          this.clasificaciones.push(res);
        })
        this.clasificaciones = this.clasificaciones.flat(1);
      }
      catch (error){
        console.log(error)
      }
    },
    error:(err)=>{
      console.log(err)
    }
  });
}

navigateToSearchResults() {
  //this.router.navigateByUrl('/main/response');
  this.firstShow = false;
  this.response();
}

articleClick(art, par = null){
  //this.articles = [];
  this.article = art
  console.log(this.article)
  this.articleRel = null;
  console.log(par)
  if(par){
    let parEle = document.getElementById("par-"+par.id);
    parEle.style.borderBottom = "solid 2px #3366ff";
    setTimeout(()=>{parEle.style.borderBottom="none";},1000);
    parEle.scrollIntoView({behavior:"smooth", block:"center"});
  }
}

addArticle(ar){
  //this.articles.push(ar);
  this.articleRel = ar;
  console.log(this.articleRel)
}

}
