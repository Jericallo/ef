import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import { Capacitations } from 'src/app/shared/interfaces/capacitations-interface';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { GlobalTitleService } from 'src/app/shared/services/global-title.service';

@Component({
  selector: 'app-capacitations',
  templateUrl: './capacitations.component.html',
  styleUrls: ['./capacitations.component.css']
})
export class CapacitationsComponent implements OnInit {
  
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;
  showMain = false;
  capacitations: Capacitations[] = [];

  title = "Capacitaciones";

  constructor(public getDocumentsService: DocumentsService, public snackBar: MatSnackBar, private _router: Router, private globalTitle: GlobalTitleService) {
    this.globalTitle.updateGlobalTitle(this.title);
    sessionStorage.removeItem('state');
  }

  ngOnInit() {
    this.showMain = false;
    this.showSpinner = true;
    this.getCapacitations();
  }

  getCapacitations(): Observable<any> {
    this.getDocumentsService.getCapacitations()
    .subscribe({
      next: response => {
        this.showMain = true;
        this.showSpinner = false;
        this.capacitations = response.result;
      },
      error: err => {
        this.showMain = true;
        this.showSpinner = false;
        console.log(err);
        this.snackBar.open("Error al cargar las Capacitaciones", '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    });
    return this.getDocumentsService.getCapacitations();
  }

  goToVideo(cap: Capacitations, restart?: boolean) {
    restart ? cap.restart = restart : false;
    const navigationExtras: NavigationExtras = { state: cap }
    this._router.navigate(['videos'], navigationExtras);
  }

  public prevCapacitation(current: Capacitations) {
    this.getCapacitations().subscribe({
      next: response => {
        this.capacitations = response.result;
      },
      error: err => {
        console.log(err);
      }, 
      complete: () => {
        this.manageCapacitations("prev", current);
      }
    });
  }

  public nextCapacitation(current: Capacitations) {
    this.getCapacitations().subscribe({
      next: response => {
        this.capacitations = response.result;
      },
      error: err => {
        console.log(err);
      }, 
      complete: () => {
        this.manageCapacitations("next", current);
      }
    });
  }

  private manageCapacitations(type: string, current: Capacitations) {
    const index = this.capacitations.findIndex(cap => cap.id == current.id);

    if(type === "prev" && index !== 0) {
      const cap: Capacitations = this.capacitations[index - 1];
      this.goToVideo(cap);
    } else if(type === "prev" && index == 0) {
      this.goToVideo(current);
    } else if(type === "next" && index !== this.capacitations.length - 1) {
      const cap: Capacitations = this.capacitations[index + 1];
      this.goToVideo(cap);
    } else if(type === "next" && index === this.capacitations.length - 1) {
      this.goToVideo(current);
    }
  }

}
