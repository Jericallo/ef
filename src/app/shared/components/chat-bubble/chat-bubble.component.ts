import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {

  @Input() openChat = true;

  newMessageText: string = '';
  messages: { text: string, type: 'sent' | 'received' }[] = [];
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  private socket: Socket; 
  searchTerm: string = '';
  users: any[] = []; 
  filteredUsers: any[] = []; 
  selectedUser: any | null = null;

  constructor( private apiService: ApiService ) { 
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
        console.log('USUARIOS FILTRADOS', this.filteredUsers)
        this.filteredUsers.forEach((element) => {
          if(element.id === 29){
            this.selectUser(element)
          }
        })
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
  
    // Desuscribirse del evento 'conversation' antes de suscribirse nuevamente
    this.socket.off('conversation');
  
    const conversationBody = {
      to: this.selectedUser.id
    };
  
    console.log(conversationBody);
    this.socket.emit('conversation', conversationBody);
  
    this.socket.on('conversation', (messageData) => {
      console.log(messageData);
  
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

  sendMessage(message: string) {
    const inputValue = message;
    console.log('sending', inputValue, this.selectedUser)
    if (inputValue.trim() !== ''  && this.selectedUser) {
      console.log(this.selectedUser.id)
      const messagePayload = {
        to: this.selectedUser.id,  
        content: {
          mensaje: inputValue.trim(),
          fecha_envio: Date.now()
        }
      };
      this.socket.emit('message', messagePayload);
      this.messages.push({ text: inputValue.trim(), type: 'sent' });
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

  toggleChat(){
    this.openChat = true
  }
}
