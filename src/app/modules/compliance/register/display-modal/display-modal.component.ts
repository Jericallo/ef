import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-display-modal',
  templateUrl: './display-modal.component.html',
  styleUrls: ['./display-modal.component.scss']
})
export class DisplayModalComponent implements OnInit {
  objectProperties = null;
  article = null

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private api:ApiService) { 
    this.objectProperties = data
  }

  ngOnInit(): void {
    switch (this.objectProperties.mode){
      case 1:
        this.obtenerArticulo()
        break
      default:
        console.log('jsajsjas')
    }
  }

  obtenerArticulo() {
    console.log(this.objectProperties)
    if(this.objectProperties.content.art !== undefined){
      this.api.getArticleById(this.objectProperties.content.art.id).subscribe({
        next: res => {
          res = JSON.parse(this.api.decrypt(res.message, 'private'));
          this.article = res.result[0]
          console.log(this.article)
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      this.api.getArticleById(this.objectProperties.content.id).subscribe({
        next: res => {
          res = JSON.parse(this.api.decrypt(res.message, 'private'));
          this.article = res.result[0]
          console.log(this.article)
        },
        error: err => {
          console.log(err);
        }
      });
    }
    
  }
}
