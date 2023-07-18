import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';


@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent {

  input: string;
  public keyword = "nombre";
  data = [];


  constructor(private apiService:ApiService, private router: Router){}
  ngOnInit(): void {
    this.get();
  }

private get(){

  this.apiService.getAll(this.apiService.MODELS.topics).subscribe({
    next:(res)=>{
      try {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        res.result.forEach(res =>{
          this.data.push(res.palabras);
        })
        this.data = this.data.flat(1);
        console.log(this.data)
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
   this.apiService.content('articulos',this.input).subscribe({
     next:(res)=>{
       try{
         res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
         res.result.forEach(res =>{
           this.data.push(res.palabras);
         })
         this.data = this.data.flat(1);
         console.log(this.data)
       }
       catch (error){
        console.log(error)
      }
    },
    error:()=>{}
  });
   //this.apiService.content(default, this.n)
 }

 navigateToSearchResults() {
  this.response();
}

}
