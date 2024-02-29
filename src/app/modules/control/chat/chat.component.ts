import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  newMessageText: string = '';
  sentMessages: { text: string }[] = [];  // Arreglo para mensajes enviados
  receivedMessages: { text: string }[] = [];  // Arreglo para mensajes recibidos
  @ViewChild('messageContainer') private messageContainer: ElementRef;

  constructor(private socket: Socket) {
    this.socket.connect();

    this.socket.on('message', (message: string) => {
      this.receivedMessages.push({ text: message });
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
      // Envía el mensaje al servidor y agrégalo a los mensajes enviados
      this.socket.emit('message', this.newMessageText.trim());
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
