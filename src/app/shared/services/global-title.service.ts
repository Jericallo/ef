import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class GlobalTitleService {

  private title: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public title$: Observable<string> = this.title.asObservable();

  constructor() { }

  updateGlobalTitle(globalTitle: string) {
    this.title.next(globalTitle);
  }

}
