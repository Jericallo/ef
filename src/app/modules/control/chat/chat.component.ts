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
    this.socket = io('wss://api.escudofiscal.alphadev.io', {
      transports: ['websocket'],
    });    
    this.socket.on('message', (data) => {
      console.log(data);
      this.messages.push({ text: data, type: 'received' });
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data.result;
        this.filteredUsers = this.users; 
        console.log(this.users);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessageText.trim() !== '') {
      const messagePayload = {
        username: this.selectedUser.id,  
        message: this.newMessageText.trim()
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
