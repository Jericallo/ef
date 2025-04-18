import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user = this.apiService.getWholeUser()
      switch(state.url){
        case '/main/intro':
          const a = user.perfil.perfiles_modulos.findIndex((element:any) => element.modulos.nombre === 'Intro')
          if (a === -1){
            this.router.navigate(['/main']);
            return false
          } else {
            return true
          }
        case '/main/news':
          const b = user.perfil.perfiles_modulos.findIndex((element:any) => element.modulos.nombre === 'Noticias')
          if (b === -1){
            this.router.navigate(['/main']);
            return false
          } else {
            return true
          }
        case '/main/laws':
          const c = user.perfil.perfiles_modulos.findIndex((element:any) => element.modulos.nombre === 'Leyes')
          if (c === -1){
            this.router.navigate(['/main']);
            return false
          } else {
            return true
          }
        case '/main/topics':
          const d = user.perfil.perfiles_modulos.findIndex((element:any) => element.modulos.nombre === 'Temario')
          if (d === -1){
            this.router.navigate(['/main']);
            return false
          } else {
            return true
          }
        case '/main/busqueda':
          const e = user.perfil.perfiles_modulos.findIndex((element:any) => element.modulos.nombre === 'Busqueda')
          if (e === -1){
            this.router.navigate(['/main']);
            return false
          } else {
            return true
         }
        default:
          return true
      }

    
    console.log(user)
    console.log(route, state)
  }
}
