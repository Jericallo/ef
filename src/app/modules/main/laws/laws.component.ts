import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatAccordion } from '@angular/material/expansion';
import { E } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2'
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss']
})
export class LawsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion:MatAccordion;
  isExpanded: boolean = false;
  data = {clasifications:[]};
  dataSegmented = {}

  article=[];
  articles=[];
  articleRel = null;
  isAdmin: boolean = false;

  rowTable:number=0;
  subRowTable:number=-1;

  indexado = 0

  public showSearch = false;

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.getClasifications();
    const tokenEscudo = JSON.parse(localStorage.getItem('token_escudo'));
    if (tokenEscudo && tokenEscudo.nombre_perfil === 'Administrador') {
      this.isAdmin = true;
    }else{
      this.isAdmin = false
    }
  }

  toggleNode() {
    this.isExpanded = !this.isExpanded;
  }



  articleClick(art, par = null, doc = '', tit='', cap='', sec=''){
    art.nombre_doc = doc
    art.nombre_cap = cap
    art.nombre_tit = tit
    art.nombre_sec = sec


    this.article.push(art);

    this.articleRel = null;
    if(par){
      let parEle = document.getElementById("par-"+par.id);
      parEle.style.borderBottom = "solid 2px #3366ff";
      setTimeout(()=>{parEle.style.borderBottom="none";},1000);
      parEle.scrollIntoView({behavior:"smooth", block:"center"});
    }

    this.indexado = this.article.length 
  }

  onTabChange(event: MatTabGroup) {
    console.log(this.article.length)
    if(this.article.length === 5){
      this.article.shift()
    }
    console.log('a')
    // Por ejemplo, puedes centrar la pestaña en la vista
    event.selectedIndex = this.article.length;
  }

  cerrarTodasPestanas() {
    this.article = []; 
  }

  getClasifications(){
    this.data.clasifications = [];
    this.rowTable = 0;
    this.subRowTable = -1;
    this.apiService.getAll("clasificaciones").subscribe({
      next:res=>{
        console.log('RES', res)
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
              this.getArticles(this.data.clasifications[index].documents[d].id);              
            }
            break;
          } 
        }
      },
      error:()=>{},
      complete:()=>{}
    });
  }

  getEverything(id_documento){
    this.apiService.emergencyContent('articulos','id_documento='+id_documento).subscribe({
      next:res=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.dataSegmented = res.result[0].documentos[0]
        console.log(this.dataSegmented)
      },
      error:()=>{},
      complete:()=>{}
    });
  }

  
  getTitles(id_documento){
    this.apiService.getAll("articulo_titulo","","",-1,-1,{id_documento:id_documento}).subscribe({
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
    this.apiService.getAll("articulo_capitulos","","",-1,-1,(id_titulo === 0 ? {id_documento:id_documento}:{id_titulo:id_titulo})).subscribe({
      next:res=>{
        if(res !== null){
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
        }
        this.getArticles(id_documento, id_titulo);
      },
      error:(msg)=>{
        if(msg.error.message){
          this.getArticles(id_documento, id_titulo);
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
    let querys = null
    if(id_titulo === 0 && id_capitulo === 0){
      querys = {id_documento:id_documento}
    } else if(id_titulo === 0 && id_capitulo !== 0) {
      querys = {id_documento:id_documento, id_capitulo:id_capitulo}
    } else if(id_titulo !== 0 && id_capitulo === 0) {
      querys = {id_documento:id_documento, id_titulo:id_titulo}
    } else {
      querys = {id_documento:id_documento, id_titulo:id_titulo, id_capitulo:id_capitulo}
    }
    //querys = {id_documento:id_documento}
    this.apiService.getAll("articulos","","",-1,-1,querys).subscribe({
      next:res=>{
        if(res === null){return}
        if(res.message == 'yAfu2LmX+QNhwJG99OWNO82jTZgZSx9OAUHJJoXrXBQ0bzRPJbK6XFWH4mUG+TjOJ+9oz+DoRFkx9xnLEIHc8Q=='){return}
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
              if(this.data.clasifications[c].documents[d].id == id_documento && 'titles' in this.data.clasifications[c].documents[d]){
                if(this.data.clasifications[c].documents[d].titles.length > 0){
                for (let t = 0; t < this.data.clasifications[c].documents[d].titles.length; t++) {
                  if(this.data.clasifications[c].documents[d].titles[t].id == id_titulo){
                    this.data.clasifications[c].documents[d].titles[t].articles = res.result;
                    findit = true;
                    break;
                  }
                  if(findit) break;
                }}
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
    console.log(this.articleRel)
  }

  deleteS(id:number, model:string){

    Swal.fire({
      title: '¿Seguro que deseas borrar este elemento?',
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: `Borrar`,
      showConfirmButton:false,
      cancelButtonText:"Cancelar"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        
      } else if (result.isDenied) {
        this.apiService.delete(model, id).subscribe({
          next:res=>{
            res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
            this.findById(id, model)
          },
          error:(msg)=>{
            msg = JSON.parse(this.apiService.decrypt(msg.message,this.apiService.getPrivateKey()))
            console.log(msg)
          }
        })
      }
    })
    
  }

  findById(id:number, model:string) {
    if(model === 'articulos')
    for (const clasifications of this.data.clasifications) {
      for(const documents of clasifications.documents) {
        for( const titulos of documents.titles){
          for(const capitulos of titulos.chapters){
            capitulos.articles.splice(id, 1)
          }
        }
      }
    }
    else if (model === 'clasificaciones') {
      const foundArticle = this.data.clasifications.find(document => document.id === id);
        if (foundArticle) {
          const indexOf = this.data.clasifications.indexOf(foundArticle)
          this.data.clasifications.splice(indexOf, 1)
          return foundArticle;
        }
    } else if (model === 'documentos') {
      for (const clasifications of this.data.clasifications) {
        const foundArticle = clasifications.documents.find(document => document.id === id);
        if (foundArticle) {
          const indexOf = clasifications.documents.indexOf(foundArticle)
          clasifications.documents.splice(indexOf, 1)
          return foundArticle;
        }
      }
    } else if (model === 'articulo_titulos') {
      for (const clasifications of this.data.clasifications) {
        for(const documentos of clasifications.documents){
          const foundArticle = documentos.titles.find(document => document.id === id);
          if (foundArticle) {
            const indexOf = documentos.titles.indexOf(foundArticle)
            //console.log(foundArticle)
            documentos.titles.splice(indexOf, 1)
            return foundArticle;
          }
        }
      }
    } else if (model === 'articulo_capitulos') {
      for (const clasifications of this.data.clasifications) {
        for(const documentos of clasifications.documents){
          for( const titulos of documentos.titles){
            const foundArticle = titulos.chapters.find(document => document.id === id);
            if (foundArticle) {
              const indexOf = titulos.chapters.indexOf(foundArticle)
              //console.log(foundArticle)
              titulos.chapters.splice(indexOf, 1)
              return foundArticle;
            }
          }
          
        }
      }
    }
    return null; // Si no se encuentra el artículo con el id proporcionado
  }

  cerrarPestana(index: number) {
    this.article.splice(index, 1);
  }

}
