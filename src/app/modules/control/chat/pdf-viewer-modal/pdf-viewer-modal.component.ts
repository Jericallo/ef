// pdf-viewer-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html', 
})
export class PdfViewerModalComponent {
  pdfUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { pdfUrl: string },
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PdfViewerModalComponent>  
  ) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.pdfUrl);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
