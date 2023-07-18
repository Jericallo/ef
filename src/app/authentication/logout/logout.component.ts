import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private apiService:ApiService, private router:Router) { }

  ngOnInit(): void {
    localStorage.removeItem(this.apiService.TOKEN);
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

}
