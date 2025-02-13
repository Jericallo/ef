import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-compliance-notifications',
  templateUrl: './compliance-notifications.component.html',
  styleUrls: ['./compliance-notifications.component.scss']
})
export class ComplianceNotificationsComponent implements OnInit {
  data = [];

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.getDeclarations()
  }

  getDeclarations () {
    this.apiService.getNotifications().subscribe({
      next: res => {
        console.log(res)
        const result = res.map((element) => {
          return {
            id:element.id,
            date:element.createdAt.split('T')[0],
            content:element.data,
            hour:element.createdAt.split('T')[1]
          }
        })

        this.data = result
      }, error: err => {
        console.error(err)
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

}
