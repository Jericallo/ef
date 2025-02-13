import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-compliance-tax-return',
  templateUrl: './compliance-tax-return.component.html',
  styleUrls: ['./compliance-tax-return.component.scss']
})
export class ComplianceTaxReturnComponent implements OnInit {
  nowYear = new Date().getFullYear()

  taxReturnYear=null
  taxReturnMonths=[]
  showContent = true

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.getDeclarations()
  }

  getDeclarations () {
    this.apiService.getAllTaxReturn(this.nowYear).subscribe({
      next: res => {
        this.showContent = true
        this.taxReturnMonths = res.taxReturnsMonth
        this.taxReturnYear = res.taxReturns[0]
      }, error: err => {
        this.showContent = false
      }
    })
  }
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

  nextYear() {
    this.nowYear ++
    this.getDeclarations()
  }

  previousYear() {
    this.nowYear --
    this.getDeclarations()
  }

  dateParser(date:string):string {
    const date_parsed = new Date(date)
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    return `${date_parsed.getDate()} de ${months[date_parsed.getMonth()]} del ${date_parsed.getFullYear()}`
  }
}
