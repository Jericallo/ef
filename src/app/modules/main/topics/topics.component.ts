import { Component, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree'
import { ApiService } from 'src/app/shared/services/api.service';

const TREE_DATA: ExampleFlatNode[] = [
  
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
  url?:string;
  children:ExampleFlatNode[]
}

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  //@ViewChild('treeControl')
  data=[];
  selectedNode: any;
  clasificaciones = [];
  article=null;
  articleRel=null;
  articlesFull = [];
  title = ''

  treeControl = new NestedTreeControl((node:ExampleFlatNode) => node.children);

  dataSource = new ArrayDataSource<ExampleFlatNode>(TREE_DATA); 

  hasChild = (_: number, node: ExampleFlatNode) => !!node.children && node.children.length > 0;

  constructor(private apiService:ApiService){}
  ngOnInit(): void {this.get(); this.getAll()}

  private get(){
    this.apiService.getAll(this.apiService.MODELS.topics).subscribe({
      next:(res)=>{
        try {
          let b = []
          res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
          res.result.forEach(res => {
            const a = ({expandable:true, isExpanded:true, name:res.letra.toUpperCase(), level:0, children:[]} as ExampleFlatNode)
            res.palabras.forEach(pal => {
              a.children.push({expandable:false, name:pal.nombre, level:1, url:pal.url} as ExampleFlatNode)
              b.push({expandable:false, name:pal.nombre, level:1, url:pal.url} as ExampleFlatNode)
            });

            this.data.push(a)
          });
          console.log(this.data)
          console.log(b)
          //this.dataSource.disconnect();// = null;// = new ArrayDataSource(this.data);
          this.dataSource = new ArrayDataSource(b);
          console.log(this.data)
          //this.dataSource.connect();
          //this.treeControl.render
        } catch (error) {
          console.log(error)
        }
      },
      error:()=>{}
    });
  }

  private showContent(search){
    this.apiService.content(this.apiService.MODELS.articles,search).subscribe({
      next:(res)=>{
        try {
          res = JSON.parse(this.apiService.decrypt(res.message,'private'))
          console.log(res)
          this.clasificaciones = res.result;
          /*res.result.forEach(res => {
            this.data.push({expandable:true, isExpanded:true, name:res.letra.toUpperCase(), level:0} as ExampleFlatNode)
            res.palabras.forEach(pal => {
              this.data.push({expandable:false, name:pal.nombre, level:1, url:pal.url} as ExampleFlatNode)
            });
          });*/
          //this.dataSource.disconnect();// = null;// = new ArrayDataSource(this.data);
          //this.dataSource = new ArrayDataSource(this.data);
          //this.dataSource.connect();
          //this.treeControl.render
        } catch (error) {
          console.log(error)
        }
      },
      error:()=>{}
    });
  }

  getParentNode(node: ExampleFlatNode): any {
    const nodeIndex = TREE_DATA.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (TREE_DATA[i].level === node.level - 1) {
        return TREE_DATA[i];
      }
    }

    return null;
  }

  shouldRender(node: ExampleFlatNode): any {
    const parent = this.getParentNode(node);
    return !parent || parent.isExpanded;
  }

  articleClick(art, par = null){
    //this.articles = [];
    this.article = art
    console.log(this.article)
    this.articleRel = null;
    console.log(this.article.parrafos[0].articulos_relacionados)
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

}
