import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss']
})
export class LawsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion:MatAccordion;

  data = {clasifications:[]};

  article=null;
  articles=[];
  articleRel = null;

  rowTable:number=0;
  subRowTable:number=-1;

  public showSearch = false;

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.getClasifications();
  }


  articleClick(art, par = null){
    //this.articles = [];
    this.article = art;
    this.articleRel = null;
    if(par){
      let parEle = document.getElementById("par-"+par.id);
      parEle.style.borderBottom = "solid 2px #3366ff";
      setTimeout(()=>{parEle.style.borderBottom="none";},1000);
      parEle.scrollIntoView({behavior:"smooth", block:"center"});
    }
  }

  getClasifications(){
    this.data.clasifications = [];
    this.rowTable = 0;
    this.subRowTable = -1;
    this.apiService.getAll("clasificaciones").subscribe({
      next:res=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.data.clasifications = res.result;
        if(this.data.clasifications.length > 0){
          for (const index in this.data.clasifications) {
            this.getDocuments(this.data.clasifications[index].id);
          }
        }
      },
      error:()=>{},
      complete:()=>{}
    });
  }

  getDocuments(id_categoria){
    /*this.data.clasifications = [];
    this.rowTable = 0;
    this.subRowTable = -1;*/
    this.apiService.getAll("documentos","","",-1,-1,{id_categoria:id_categoria}).subscribe({
      next:res=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        for (let index = 0; index < this.data.clasifications.length; index++) {
          if(this.data.clasifications[index].id == id_categoria){
            this.data.clasifications[index].documents = res.result;
            for (let d = 0; d < this.data.clasifications[index].documents.length; d++) {
              this.getTitles(this.data.clasifications[index].documents[d].id);
              //this.getArticles(this.data.clasifications[index].documents[d].id);              
            }
            break;
          } 
        }
      },
      error:()=>{},
      complete:()=>{}
    });
  }

  getTitles(id_documento){
    this.apiService.getAll("articulo_titulos","","",-1,-1,{id_documento:id_documento}).subscribe({
      next:res=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        let findit = false; 
        for (let c = 0; c < this.data.clasifications.length; c++) {
          for (let d = 0; d < this.data.clasifications[c].documents.length; d++) {
            if(this.data.clasifications[c].documents[d].id == id_documento){
              this.data.clasifications[c].documents[d].titles = res.result;
              res.result.forEach(tit => {
                this.getChapters(id_documento, tit.id);
              });
              findit = true;
              break;
            }
          }
          if(findit) break;
        }
      },
      error:(msg)=>{
        if(msg.error.message){
          this.getChapters(id_documento, 0);
        }
      },
      complete:()=>{}
    });
  }

  getChapters(id_documento, id_titulo){
    this.apiService.getAll("articulo_capitulos","","",-1,-1,(id_titulo == 0 ? {id_documento:id_documento}:{id_titulo:id_titulo})).subscribe({
      next:res=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        let findit = false; 
        for (let c = 0; c < this.data.clasifications.length; c++) {
          for (let d = 0; d < this.data.clasifications[c].documents.length; d++) {
            if(this.data.clasifications[c].documents[d].id == id_documento){
              if(id_titulo != 0){
                for (let t = 0; t < this.data.clasifications[c].documents[d].titles.length; t++) {
                  if(this.data.clasifications[c].documents[d].titles[t].id == id_titulo){
                    this.data.clasifications[c].documents[d].titles[t].chapters = res.result;
                    res.result.forEach(cha => {
                      this.getArticles(id_documento, id_titulo, cha.id);
                    });
                    findit = true;break;
                  }
                }
              }else{
                this.data.clasifications[c].documents[d].chapters = res.result;
                res.result.forEach(tit => {
                  this.getArticles(id_documento, id_titulo, tit.id);
                });
                findit = true;break;
              }
            }
            if(findit) break;
          }
          if(findit) break;
        }
        this.getArticles(id_documento, id_titulo, 0);
      },
      error:(msg)=>{
        if(msg.error.message){
          this.getArticles(id_documento, id_titulo, 0);
        }
      },
      complete:()=>{}
    });
  }

  getSections(id_documento, id_titulo, id_capitulo){
    this.apiService.getAll(this.apiService.MODELS.article_sections,"","",-1,-1,(id_titulo == 0 ? {id_documento:id_documento}:{id_titulo:id_titulo})).subscribe({
      next:res=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        let findit = false; 
        for (let c = 0; c < this.data.clasifications.length; c++) {
          for (let d = 0; d < this.data.clasifications[c].documents.length; d++) {
            if(this.data.clasifications[c].documents[d].id == id_documento){
              if(id_titulo != 0){
                for (let t = 0; t < this.data.clasifications[c].documents[d].titles.length; t++) {
                  if(this.data.clasifications[c].documents[d].titles[t].id == id_titulo){
                    this.data.clasifications[c].documents[d].titles[t].chapters = res.result;
                    res.result.forEach(cha => {
                      this.getArticles(id_documento, id_titulo, cha.id);
                    });
                    findit = true;break;
                  }
                }
              }else{
                this.data.clasifications[c].documents[d].chapters = res.result;
                res.result.forEach(tit => {
                  this.getArticles(id_documento, id_titulo, tit.id);
                });
                findit = true;break;
              }
            }
            if(findit) break;
          }
          if(findit) break;
        }
        this.getArticles(id_documento, id_titulo, 0);
      },
      error:(msg)=>{
        if(msg.error.message){
          this.getArticles(id_documento, id_titulo, 0);
        }
      },
      complete:()=>{}
    });
  }

  getArticles(id_documento, id_titulo=0, id_capitulo=0){
    this.apiService.getAll("articulos","","",-1,-1,{id_documento:id_documento, id_titulo:id_titulo, id_capitulo:id_capitulo}).subscribe({
      next:res=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        if(id_capitulo != 0){
          let findit = false;
          for (let c = 0; c < this.data.clasifications.length; c++) {
            for (let d = 0; d < this.data.clasifications[c].documents.length; d++) {
              if(this.data.clasifications[c].documents[d].id == id_documento){
                if(id_titulo != 0){
                  for (let t = 0; t < this.data.clasifications[c].documents[d].titles.length; t++) {
                    if(this.data.clasifications[c].documents[d].titles[t].id == id_titulo){
                      for (let ch = 0; ch < this.data.clasifications[c].documents[d].titles[t].chapters.length; ch++) {
                        if(this.data.clasifications[c].documents[d].titles[t].chapters[ch].id == id_capitulo){
                          this.data.clasifications[c].documents[d].titles[t].chapters[ch].articles = res.result;
                          findit = true;
                          break;
                        }
                      }
                    }
                    if(findit) break;
                  }
                }else{
                  for (let ch = 0; ch < this.data.clasifications[c].documents[d].chapters.length; ch++) {
                    if(this.data.clasifications[c].documents[d].chapters[ch].id == id_capitulo){
                      this.data.clasifications[c].documents[d].chapters[ch].articles = res.result;
                      findit = true;break;
                    }
                    if(findit) break;
                  }
                }
              }
              if(findit) break;
            }
            if(findit) break;
          }
        }else{
          let findit = false;
          for (let c = 0; c < this.data.clasifications.length; c++) {
            for (let d = 0; d < this.data.clasifications[c].documents.length; d++) {
              if(this.data.clasifications[c].documents[d].id == id_documento){
                for (let t = 0; t < this.data.clasifications[c].documents[d].titles.length; t++) {
                  if(this.data.clasifications[c].documents[d].titles[t].id == id_titulo){
                    this.data.clasifications[c].documents[d].titles[t].articles = res.result;
                    findit = true;
                    break;
                  }
                  if(findit) break;
                }
              }
              if(findit) break;
            }
            if(findit) break;
          }
        }
      },
      error:()=>{},
      complete:()=>{}
    });
  }

  addArticle(ar){
    //this.articles.push(ar);
    this.articleRel = ar;
  }

}
