import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  message: string = "";
  avg: string = "";
  result:Boolean = false;
  colorText = 'black';
  showQuestBtn = false

  constructor(private _router: Router,public dialog: MatDialog) {
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as any;
    this.message = state.message;
    this.setRating(state);
  }

  ngOnInit(): void {}

  tryAgain() {
    this._router.navigate(['control/cuestionario']);
  }

  goToVideo() {
    this._router.navigate(['control/videos']);
  }

  setRating(state: any) {
    this.avg = state.data.promedio;
    this.result = state.data.aprobado;
    const avg = this.avg;
    console.log(avg);
    if(avg <= "5") {
      //Red
      this.colorText = "red";
      this.showQuestBtn = false;
    } else if(avg > "5" && avg < "8") {
      //Yellow
      this.colorText = "gold";
      this.showQuestBtn = true;
    } else if(avg > "8") {
      //Verde
      this.colorText = "green";
      this.showQuestBtn = false;
    }
  }

  exit() {
    sessionStorage.removeItem('state');
    this._router.navigate(['capacitaciones']);
  }

}
