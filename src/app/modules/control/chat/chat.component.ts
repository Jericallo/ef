import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  newMessageText: string = '';
  messages: { text: string, type: 'sent' | 'received' }[] = [];
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  private socket: Socket; 
  searchTerm: string = '';
  users: any[] = []; 
  filteredUsers: any[] = []; 
  selectedUser: any | null = null;

  constructor(private apiService: ApiService) {
    const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
    
    if(userId !== null){
    this.socket = io('wss://api.escudofiscal.alphadev.io', {
     extraHeaders: {
         id: userId
      }
    });    
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de sockets con ID:', userId);
      });
  
    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor de sockets');
    });
  
    this.socket.on('message', (data) => {
      console.log(data)
      this.messages.push({ text: data.content.mensaje, type: 'received' });
      this.scrollToBottom();
    });     
  }
  }
  

  ngOnInit(): void {
    this.getUsers()
    if (this.users.length > 0) {
      this.selectUser(this.users[0]);
    }
  }

  getUsers() {
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data.result;
        this.filteredUsers = this.users; 
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  
  selectUser(user: any) {
    this.messages = [];
    this.selectedUser = user;
    const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
  
    this.socket.off('conversation');
  
    const conversationBody = {
      to: this.selectedUser.id
    };
    this.socket.emit('conversation', conversationBody);
  
    this.socket.on('conversation', (messageData) => {  
      messageData.forEach((message) => {
        const messageType = message.from === userId ? 'sent' : 'received';
        this.messages.push({ text: message.message, type: messageType });
      });
  
      this.scrollToBottom();
    });
  }
  

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessageText.trim() !== ''  && this.selectedUser) {
      console.log(this.selectedUser.id)
      const messagePayload = {
        to: this.selectedUser.id,  
        content: {
          mensaje: this.newMessageText.trim(),
          fecha_envio: Date.now()
        }
      };
      this.socket.emit('message', messagePayload);
      this.messages.push({ text: this.newMessageText.trim(), type: 'sent' });
      this.newMessageText = '';
    }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
