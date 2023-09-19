import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { NotificationType, INotification } from 'src/app/shared/interfaces/notification-interface';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {constructor() { }
    
    private notification$: Subject<INotification> = new BehaviorSubject(null);
    
    success(message: string, duration: number = null) {
        this.notify(message, NotificationType.Baja, duration);
    }    warning(message: string, duration: number = null) {
        this.notify(message, NotificationType.Media, duration);
    }    error(message: string, duration: number = null) {
        this.notify(message, NotificationType.Alta, duration);
    }    private notify(message: string, type: NotificationType,       duration: number) {
        duration = !duration ? 3000 : duration;
        this.notification$.next({
            message: message,
            type: type,
            duration: duration
        } as INotification);
    }get notification() {
        return this.notification$.asObservable();
    }
}