import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { io, Socket } from 'socket.io-client';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  newMessageText: string = '';
  sentMessages: { text: string }[] = [];
  receivedMessages: { text: string }[] = [];
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  private socket: Socket; 

  constructor() {
    this.socket = io('wss://api.escudofiscal.alphadev.io', {
      transports: ['websocket'],
    });    
    this.socket.on('message', (data) => {
      console.log(data)
      this.receivedMessages.push(data);
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessageText.trim() !== '') {
      const messagePayload = {
        username: 'App',  
        message: this.newMessageText.trim()
      };
  
      this.socket.emit('message', messagePayload);
      this.sentMessages.push({ text: this.newMessageText.trim() });
      
      this.newMessageText = '';
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
