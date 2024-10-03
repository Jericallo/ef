import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss']
})
export class MyCompanyComponent implements OnInit {
  empresaForm: FormGroup;
  regimenes = ['Regimen 1', 'Regimen 2', 'Regimen 3'];  // Example values
  actividades = ['Actividad 1', 'Actividad 2', 'Actividad 3'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.empresaForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.maxLength(100)]],
      rfc: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{14}$')]],
      regimenFiscal: ['', Validators.required],
      actividad: ['', Validators.required],
      calle: ['', [Validators.required, Validators.maxLength(100)]],
      noExterior: ['', [Validators.required, Validators.maxLength(5)]],
      noInterior: ['', Validators.maxLength(5)],
      cp: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      ciudad: ['', [Validators.required, Validators.maxLength(100)]],
      estado: ['', [Validators.required, Validators.maxLength(100)]],
      certificadoFiel: [null, Validators.required],
      llavePrivadaFiel: [null, Validators.required],
      contrasenaFiel: ['', [Validators.required, Validators.maxLength(20)]],
      certificadoSellos: [null, Validators.required],
      llavePrivadaSellos: [null, Validators.required],
      contrasenaSellos: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

}
