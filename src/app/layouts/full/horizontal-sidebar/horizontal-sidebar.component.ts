import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { HorizontalMenuItems } from '../../../shared/menu-items/horizontal-menu-items';

@Component({
  selector: 'app-horizontal-sidebar',
  templateUrl: './horizontal-sidebar.component.html',
  styleUrls: []
})

export class HorizontalAppSidebarComponent implements OnDestroy, OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  backgroundColor: string = 'red'
  subItemVisible:boolean = false
  
  private _mobileQueryListener: () => void;
  

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: HorizontalMenuItems
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    
  }

  ngOnInit(): void {
    let a = document.getElementsByClassName('mat-list-item')//.addEventListener('mouseover',(event) => {console.log('hola')})
  }

  subitem = null
  contador = 0
  a = null
  intervalo = null

  funcion(object:any){
    if(this.a !== null) {
      let arreglo = Array.prototype.slice.call(this.a)
      console.log(arreglo, Array.prototype.slice.call(this.a), this.a)
      arreglo[0].style.overflow = 'hidden'
      if(this.intervalo !== null){
        clearInterval(this.intervalo)
      }

      this.a = null
    }
    this.a = document.getElementsByClassName('juice-item-'+object)//.addEventListener('mouseover',(event) => {console.log('hola')})
    let arreglo = Array.prototype.slice.call(this.a)
    arreglo[0].style.overflow = 'visible'
    arreglo[0].style.left = '-90px'
    arreglo[0].style.marginTop = '6px'
    this.intervalo = setInterval(()=>{
      this.contador++
      if(this.contador >= 1 ) {
        clearInterval(this.intervalo)
        arreglo[0].style.overflow = 'hidden'
      }
    },
    10000)
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleSubItemVisibility(clase:any){
    this.subItemVisible = !this.subItemVisible
  }
  
}
