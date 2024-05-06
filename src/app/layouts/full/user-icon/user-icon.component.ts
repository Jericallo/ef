import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.scss']
})
export class UserIconComponent implements OnInit {
  title = 'af-notification';
  message:any = null;
  notification_amount = 0
  notifications = []
  user:any
  showNotification = false
  isMenuOpen = false;


  constructor( private routes: Router, public apiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.apiService.getWholeUser()
    console.log(parseInt(this.apiService.getUnreadNotificationsAmmount()))
    this.notification_amount = parseInt(this.apiService.getUnreadNotificationsAmmount())
    this.notifications = this.apiService.getUnreadNotifications()
    if(this.notifications === undefined) this.notifications = []
    this.requestPermission();
    this.listen();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if(!this.isMenuOpen) this.showNotification = false
  }

  toggleNotification() {
    this.showNotification = !this.showNotification
    if(this.showNotification){
      this.apiService.postUnreadNotificationsAmmount(0)
      this.apiService.postUnreadNotifications([])
    }
  }

  // closeMenu() {
  //   this.isMenuOpen = false;
  //   this.showNotification = false;
  // }

  logOut(){
    this.routes.navigate(['/logout']);
  }
  
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           console.log(currentToken);
         } else {
           console.log('No registration token available. Request permission to generate one.');
         }     
        }).catch((err) => {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              // El usuario ha concedido permiso
            } else {
              // El usuario ha denegado el permiso o aún no ha respondido
            }
          });
        console.log('An error occurred while retrieving token. ', err);
    });
  }
  
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
      this.notification_amount++
      this.apiService.postUnreadNotificationsAmmount(this.notification_amount)
      this.notifications.push({
        id:payload.messageId,
        title:payload.notification.title,
        body:payload.notification.body
      })
      this.apiService.postUnreadNotifications(this.notifications)
    });
  }
}
