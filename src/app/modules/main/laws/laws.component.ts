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
  data = [];
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
    this.getLaws();
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

    console.log(this.article)

    this.articleRel = null;
    if(par){
      let parEle = document.getElementById("par-"+par.id);
      parEle.style.borderBottom = "solid 2px #3366ff";
      setTimeout(()=>{parEle.style.borderBottom="none";},1000);
      parEle.scrollIntoView({behavior:"smooth", block:"center"});
    }

    
    this.indexado = this.article.length 
    console.log(this.indexado)
  }

  onTabChange(event: MatTabGroup) {
    if(this.article.length === 5){
      this.article.shift()
    }
    event.selectedIndex = this.article.length;
  }

  cerrarTodasPestanas() {
    this.article = []; 
  }

  getLaws(){
    this.data = [];
    this.apiService.getLeyes().subscribe({
      next:res => {
        console.log('RESULT',res)
        this.data = res
      }, error: err => {
        console.error('ERROR',err)
      }
    })
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
          },
          error:(msg)=>{
            msg = JSON.parse(this.apiService.decrypt(msg.message,this.apiService.getPrivateKey()))
            console.log(msg)
          }
        })
      }
    })
    
  } 
  cerrarPestana(index: number) {
    this.article.splice(index, 1);
  }

}
