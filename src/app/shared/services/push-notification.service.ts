import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  messagingFirebase: firebase.messaging.Messaging;
  constructor() {
      firebase.initializeApp(environment.configFirebase)
      this.messagingFirebase = firebase.messaging();
   }
   //Solicita permiso al usuario para las notificaciones push
   requestPermission = () => {
    return new Promise(async (resolve,reject) => {
        const permiss = await Notification.requestPermission();
        if(permiss === "granted"){
          const tokenFirebase = await this.messagingFirebase.getToken();
          resolve(tokenFirebase)
        }else{
          reject(new Error("No se otorgaron los permisos"))
        }
    })
   }  
   private messagingObservable = new Observable( observe =>{
      this.messagingFirebase.onMessage(payload=>{  //devuelve la información de la notificación
        observe.next(payload)
      }) 
   })

   receiveMessage(){
      return this.messagingObservable
   }
}
