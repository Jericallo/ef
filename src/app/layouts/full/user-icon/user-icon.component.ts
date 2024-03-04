import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.scss']
})
export class UserIconComponent implements OnInit {

  user:any

  constructor( private routes: Router, public apiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.apiService.getWholeUser()
    console.log('USER',this.user)
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logOut(){
    this.routes.navigate(['/logout']);
  }
  

}
