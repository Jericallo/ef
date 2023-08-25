import { Component, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree'
import { ApiService } from 'src/app/shared/services/api.service';

const TREE_DATA: ExampleFlatNode[] = []; 
/*[
  {
    name: 'Fruit',
    expandable: true,
    level: 0,
  },
  {
    name: 'Apple',
    expandable: false,
    level: 1,
  },
  {
    name: 'Banana',
    expandable: false,
    level: 1,
  },
  {
    name: 'Fruit loops',
    expandable: false,
    level: 1,
  },
  {
    name: 'Vegetables',
    expandable: true,
    level: 0,
  },
  {
    name: 'Green',
    expandable: true,
    level: 1,
  },
  {
    name: 'Broccoli',
    expandable: false,
    level: 2,
  },
  {
    name: 'Brussels sprouts',
    expandable: false,
    level: 2,
  },
  {
    name: 'Orange',
    expandable: true,
    level: 1,
  },
  {
    name: 'Pumpkins',
    expandable: false,
    level: 2,
  },
  {
    name: 'Carrots',
    expandable: false,
    level: 2,
  },
];*/

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
  url?:string;
}

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  //@ViewChild('treeControl')
  data=[];
  clasificaciones = [];
  article=null;
  articleRel=null;

  constructor(private apiService:ApiService){}
  ngOnInit(): void {this.get()}

  private get(){
    this.apiService.getAll(this.apiService.MODELS.topics).subscribe({
      next:(res)=>{
        try {
          res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
          //this.data = res.result;
          res.result.forEach(res => {
            this.data.push({expandable:true, isExpanded:true, name:res.letra.toUpperCase(), level:0} as ExampleFlatNode)
            res.palabras.forEach(pal => {
              this.data.push({expandable:false, name:pal.nombre, level:1, url:pal.url} as ExampleFlatNode)
            });
          });
          //this.dataSource.disconnect();// = null;// = new ArrayDataSource(this.data);
          this.dataSource = new ArrayDataSource(this.data);
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
          res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
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

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  //treeFlattener = new MatTreeFlattener()

  //dataSource = new MatTreeFlatDataSource(this.treeControl) //ArrayDataSource(TREE_DATA);
  dataSource = new ArrayDataSource(TREE_DATA);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

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

}
