
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
  isTyping: boolean = false;

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
      this.socket.off('typing')
    });
  
    this.socket.on('message', (data) => {  
      this.messages.push({ text: data.content.mensaje, type: 'received' });
      this.scrollToBottom();
    });  
    
    this.socket.on('typing', (data) => {
      const typingUserId = data.message[0];  
      let typingUserIndex = -1;
      this.filteredUsers.forEach((element, index) => {
        if (element.id === parseInt(typingUserId)) {
          typingUserIndex = index;
        }
      });
      if (typingUserIndex !== -1) {
        this.filteredUsers[typingUserIndex].isTyping = true;
      }    
      if (this.selectedUser && this.selectedUser.id === typingUserId) {
        this.isTyping = true;
      }    
    });    

    this.socket.on('stoptyping', (data) => {
      console.log(data)
      const typingUserId = data.message[0];  
      let typingUserIndex = -1;
      this.filteredUsers.forEach((element, index) => {
        if (element.id === parseInt(typingUserId)) {
          typingUserIndex = index;
        }
      });
      if (typingUserIndex !== -1) {
        this.filteredUsers[typingUserIndex].isTyping = false;
      }   
      if (this.selectedUser && this.selectedUser.id === typingUserId.toString()) {
        this.isTyping = true;
      }    
    });    
  }
  }


  ngOnInit(): void {
    this.getUsers()
    if (this.users.length > 0) {
      this.selectUser(this.users[0]);
    }
  }


  handleFileInput(event: any): void {
    const file = event.target.files[0];
    // Aquí puedes realizar cualquier lógica que desees con el archivo seleccionado
    console.log('Archivo seleccionado:', file);
  }
  
  getUsers() {
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data.result.map(user => ({ ...user, isTyping: false }));
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

  checkIsTyping() {
    this.isTyping = this.newMessageText.trim() !== '';    
    if (this.isTyping) {
      console.log("prendido")
      this.socket.emit('typing', { to: this.selectedUser.id });
    } else {
      this.socket.emit('stoptyping', { to: this.selectedUser.id });
    }
  }
  

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}