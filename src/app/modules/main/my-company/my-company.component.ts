import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import mime from 'mime'

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss']
})
export class MyCompanyComponent implements OnInit {
  empresaForm: FormGroup;
  regimenes = ['Regimen 1', 'Regimen 2', 'Regimen 3', 'World peace'];  // Example values
  actividades = ['Actividad 1', 'Actividad 2', 'Actividad 3', 'World peace (And weapon manufactoring)'];

  companyId:string
  fiscalAddressId:string

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  constructor(private fb: FormBuilder, private apiService:ApiService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.empresaForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.maxLength(100)]],
      rfc: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{13}$')]],
      regimenFiscal: ['', Validators.required],
      actividad: ['', Validators.required],
      calle: ['', [Validators.required, Validators.maxLength(100)]],
      noExterior: ['', [Validators.required, Validators.maxLength(5)]],
      noInterior: ['', Validators.maxLength(5)],
      cp: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      ciudad: ['', [Validators.required, Validators.maxLength(100)]],
      estado: ['', [Validators.required, Validators.maxLength(100)]],
      certificadoFiel: [null],
      llavePrivadaFiel: [null],
      contrasenaFiel: ['', [ Validators.maxLength(20)]],
      certificadoSellos: [null],
      llavePrivadaSellos: [null],
      contrasenaSellos: ['', [Validators.maxLength(20)]],
    });

    this.apiService.fetchMyCompany(1).subscribe({
      next: res => {
        const company = res[0]
        this.empresaForm.patchValue({
          razonSocial: company.businessName,
          rfc: company.rfc,
          regimenFiscal: company.taxRegime,
          actividad: company.activity,
          calle: company.fiscalAddress.street,
          noExterior: company.fiscalAddress.exteriorNo,
          noInterior: company.fiscalAddress.interiorNo || '',
          cp: company.fiscalAddress.postalCode,
          ciudad: company.fiscalAddress.city,
          estado: company.fiscalAddress.state,
        })

        this.companyId = company.id
        this.fiscalAddressId = company.fiscalAddress.id
      }, error: err => {
        console.error(err)
      }
    })
  }

  submitMyCompany():void {
    const values = this.empresaForm.value

    const body = {
      rfc: values.rfc, 
      taxRegime:values.regimenFiscal, 
      activity:values.actividad, 
      bussinesName:values.razonSocial
    }
    this.apiService.updateMyCompany(this.companyId, body).subscribe({
      next: res => {
        const id_company = res.id
        const address_body = {
          street:values.calle, 
          city:values.ciudad, 
          state:values.estado, 
          extNumber:values.noExterior, 
          intNumber:values.noInterior, 
          zipcode:values.cp, 
          companyId:id_company
        }

        const formDataFiel = new FormData();
        formDataFiel.append('password', values.contrasenaFiel);

        // Forzamos el MIME type a 'application/x-x509-ca-cert' para certificado y llave privada
        formDataFiel.append('certFile', new Blob([values.certificadoFiel], { type: 'application/x-x509-ca-cert' }), 'certificado.cer');
        formDataFiel.append('keyFile', new Blob([values.llavePrivadaFiel], { type: 'application/x-x509-ca-cert' }), 'llave.key');

        const formDataSeal = new FormData();
        formDataSeal.append('password', values.contrasenaSellos);

        // También forzamos el MIME type para los sellos
        formDataSeal.append('certFile', new Blob([values.certificadoSellos], { type: 'application/x-x509-ca-cert' }), 'certificado_sellos.cer');
        formDataSeal.append('keyFile', new Blob([values.llavePrivadaSellos], { type: 'application/x-x509-ca-cert' }), 'llave_sellos.key');

        console.log(values.certificadoFiel instanceof File); // Debería devolver true

        console.log('BODY1', formDataFiel, values.certificadoFiel)
        console.log('BODY2', formDataSeal)

        this.apiService.addElectronicSignature(this.companyId,formDataFiel).subscribe({
          next: res => {
            console.log(res)
          }, error: err => {
            console.error(err)
          }
        })

        this.apiService.addSeal(this.companyId,formDataSeal).subscribe({
          next: res => {
            console.log(res)
          }, error: err => {
            console.error(err)
          }
        })

        this.apiService.updateFiscalDirection(this.fiscalAddressId, address_body).subscribe({
          next:res => {
            console.log(res)
            this.snackBar.open('Compañía actualizada con éxito', '', this.config_snack);
          }, error: err => {
            this.snackBar.open('Ocurrió un error al actualizar la compañía', '', this.config_snack);
            console.error(err)
          }
        })

      }, error: err => {
        this.snackBar.open('Ocurrió un error al actualizar la compañía', '', this.config_snack);
        console.error(err)
      }
    })
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    console.log(file.type)
    const type = mime.getType(file.name)
    console.log('TYPE', type)
    if (file) {
      this.empresaForm.patchValue({
        [controlName]: file
      });
      this.empresaForm.get(controlName)?.updateValueAndValidity(); // Para asegurarse de que el valor sea válido
    }
  }  
}
