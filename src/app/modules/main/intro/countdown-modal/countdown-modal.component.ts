import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown-modal',
  templateUrl: './countdown-modal.component.html',
  styleUrls: ['./countdown-modal.component.scss'],
})
export class CountdownModalComponent {
  countdown: number = 7;

  constructor(
    public dialogRef: MatDialogRef<CountdownModalComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.startCountdown();
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  goToCalendar() {
    this.router.navigate(['/compliance/index']);
    this.dialogRef.close();
  }

  goToManual() {
    this.dialogRef.close();
    this.data.scrollToBottom();
  }
}
