import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-compliance-opinion-history',
  templateUrl: './compliance-opinion-history.component.html',
  styleUrls: ['./compliance-opinion-history.component.scss']
})
export class ComplianceOpinionHistoryComponent implements OnInit {
  data = [];

  constructor(private apiService:ApiService, private sanitizer: DomSanitizer) { }

  isModalOpen = false;
  selectedItem: any = null;

  ngOnInit(): void {
    this.getDeclarations()
  }

  getDeclarations () {
    this.apiService.getDeclarations().subscribe({
      next: res => {
        console.log(res)
        const result = res.map((element) => {
          element.urlFile = element.urlFile.replace('mx//','mx/')
          return {
            id:element.id,
            companyName:element.businessName,
            rfc:element.rfc,
            date:element.updatedAt,
            response:element.opinion,
            taxRegime: element.company.taxRegime,
            activity: element.company.activity,
            file:  this.sanitizer.bypassSecurityTrustResourceUrl(element.urlFile),
          }
        })

        this.data = result
      }, error: err => {
        console.error(err)
      }
    })
  }
  

  openModal(item: any): void {
    this.selectedItem = item;
    this.isModalOpen = true;

    console.log(this.selectedItem)
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

}
