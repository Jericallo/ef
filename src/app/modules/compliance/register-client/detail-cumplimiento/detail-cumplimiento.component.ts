import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { FileServiceService } from '../../../../shared/services/file-service.service';
registerLocaleData(localeEs, "es");

@Component({
  selector: 'app-detail-cumplimiento',
  templateUrl: './detail-cumplimiento.component.html',
  styleUrls: ['./detail-cumplimiento.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: "es" }],
})
export class DetailCumplimientoComponent implements OnInit {
  disabled = false

  text_for_accountant = "Marcar como cumplido"
  showAccountant = true
  showSupervisor = false
  mostrarLeyenda = false

  blanco = true;
  mensaje_blanco = "Nada por revisar este día."

  color = 'transparent'

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any, private fileService: FileServiceService ) { }

  ngOnInit(): void {
    console.log(this.data)

    const user = this.apiService.getWholeUserV3()
    console.log(user)

    if(user.roles.includes('PayrollComplianceSupervisorRole') || user.roles.includes('PLDComplianceSupervisorRole') || user.roles.includes('GeneralComplianceSupervisorRole')) {
      this.showAccountant = true
      this.showSupervisor = false
      if(this.data.cumplimiento.completado > 0) {
        this.disabled = true
        this.text_for_accountant = 'Esperando aprobación del supervisor'
      }
    } else if(user.roles.includes('GlobalBusinessComplianceSupervisorRole', 'CompanyComplianceSupervisorRole')) {
      this.showAccountant = false
      this.showSupervisor = true
    }
  }

  changeStatusAccountant(){
    const body = {
      status: 'FinishedStatus'
    }
    this.apiService.changeObligationStatus(body, this.data.cumplimiento.id).subscribe({
      next: res => {
        this.disabled = true;
        this.text_for_accountant = 'Esperando aprobación del supervisor'
      }, error: err => {
        console.error(err)
      }
    })
  }

  changeStatusSupervisor(status:string){
    const body = {
      status
    }
    this.apiService.changeObligationStatusSueprvisor(body, this.data.cumplimiento.id).subscribe({
      next: res => {
        switch(status){
          case 'PendingStatus':
            this.data.cumplimiento.completado = 0
            break;
          case 'WaitingValidationStatus':
            this.data.cumplimiento.completado = 2
            break;
          case 'ValidatedStatus':
            this.data.cumplimiento.completado = 3
            break;
          default:
            this.data.cumplimiento.completado = 0
        }
      }, error: err => {
        console.error(err)
      }
    })
  }

  downloadFiles(archivos: { fileName: string }[]) {
    this.fileService.downloadFilesAsZip(archivos)
  }

  downloadSingleFile(archivos: { fileName: string }) {
    this.fileService.downloadFilesAsZip([archivos])
  }
}
