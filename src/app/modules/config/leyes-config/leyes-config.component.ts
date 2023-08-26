import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-leyes-config',
  templateUrl: './leyes-config.component.html',
  styleUrls: ['./leyes-config.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class LeyesConfigComponent implements OnInit {
  currentIndex: number = 0;

  next() {
    // Logic to navigate to the next form
    this.currentIndex++;
  }
  previous() {
    // Logic to navigate to the next form
    this.currentIndex--;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onDataReceived(data: number) {
    this.currentIndex += 1;
  }
}
