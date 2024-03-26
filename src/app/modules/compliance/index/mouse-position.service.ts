import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class MousePositionService {

  private dialogRef: MatDialogRef<any>;

  constructor() {}

  setDialogRef(dialogRef: MatDialogRef<any>) {
    this.dialogRef = dialogRef;
  }

  trackMousePosition(event: MouseEvent) {
    if (this.dialogRef) {

      if(event.clientY < 540){
        const modalY = event.clientY + 170;
        this.dialogRef.updatePosition({
          top: modalY + 'px',
        });
      } else {
        const modalY = event.clientY - 320;
        this.dialogRef.updatePosition({
          top: modalY + 'px',
        });
      }
      
    }
  }
}
