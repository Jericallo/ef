import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compliance-opinion-history',
  templateUrl: './compliance-opinion-history.component.html',
  styleUrls: ['./compliance-opinion-history.component.scss']
})
export class ComplianceOpinionHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  data = [
    {
      id: '1',
      companyName: 'Empresa ABC',
      rfc: 'ABC123456XYZ',
      date: '2024-12-01',
      response: 'Aprobado',
    },
    {
      id: '2',
      companyName: 'Compañía XYZ',
      rfc: 'XYZ654321ABC',
      date: '2024-12-15',
      response: 'Rechazado',
    },
  ];
  isModalOpen = false;
  selectedItem: any = null;

  openModal(item: any): void {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

}
