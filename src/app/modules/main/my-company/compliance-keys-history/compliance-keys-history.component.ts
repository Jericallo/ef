import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiService } from "src/app/shared/services/api.service";

@Component({
  selector: "app-compliance-keys-history",
  templateUrl: "./compliance-keys-history.component.html",
  styleUrls: ["./compliance-keys-history.component.scss"],
})
export class ComplianceKeysHistoryComponent implements OnInit {
  data = [];

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  isModalOpen = false;
  selectedItem: any = null;

  ngOnInit(): void {
    this.getKeys();
  }

  getKeys() {
    this.apiService.getAllKeys().subscribe({
      next: (res) => {
        console.log(res);

        this.data = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async downloadFile(url: string, filename: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al descargar el archivo");
  
      const blob = await response.blob();
      const link = document.createElement("a");
  
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  }
  
  downloadKey(url: string) {
    this.downloadFile(url, "keyfile.key");
  }
  
  downloadCert(url: string) {
    this.downloadFile(url, "certificate.cer");
  }

  parseDate(date:string):string {
    const parsedDate = new Date(date)
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

    return `${parsedDate.getDate()} de ${months[parsedDate.getMonth()]} del ${parsedDate.getFullYear()}`
  }
}