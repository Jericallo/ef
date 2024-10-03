import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { ApiService } from '../../services/api.service';
import { PdfViewerModalComponent } from 'src/app/modules/control/chat/pdf-viewer-modal/pdf-viewer-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit, AfterViewChecked {

  @Input() openChat = true;

  newMessageText: string = '';
  messages: { text: string, type: 'sent' | 'received', date:Date, isFile:string, fileURL?:string }[] = [];
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  private socket: Socket; 
  searchTerm: string = '';
  users: any[] = []; 
  filteredUsers: any[] = []; 
  selectedUser: any | null = null;
  isTyping: boolean = false;
  profile: any
  me_user: ''
  userScrollingUp: boolean = false;

  constructor( private apiService: ApiService, private dialog: MatDialog, private cdr: ChangeDetectorRef ) { 
    
    const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
    const me = apiService.getWholeUser()
    this.me_user = me.nombre
    
    if(userId !== null){
    this.socket = io('wss://apief.globalbusiness.com.mx', {
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
      let date = new Date(data.content.fecha_envio);
      if(data.content.type !== "file"){
        data.content.type = "text"
      }
      data.content.from= parseInt(data.content.from)
      this.messages.push({ text: data.content.mensaje, type: 'received', date: date, isFile: data.content.type, fileURL: data.content.filename});
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
    this.getUsers();
  }

  ngAfterViewChecked(): void {
    if (!this.userScrollingUp) {
      this.scrollToBottom();
    }
  }
  
  closeTab():void {
    this.openChat = false
  }
  


  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileNameParts = file.name.split('.');
      const extension = fileNameParts[fileNameParts.length - 1];

      const messagePayload = {
        file: file,
        content: {
          to: this.selectedUser.id,  
          mensaje: '',
          fecha_envio: Date.now(),
          type: 'file',
          extension: extension 
        }
      };

      this.socket.emit('message', messagePayload);
      this.messages.push({ text: this.newMessageText.trim(), type: 'sent', date: new Date (Date.now()), isFile:'file' });
      
      this.newMessageText = '';
    }
}

  
  getUsers() {
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data.result;
        this.filteredUsers = this.users; 
        
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

  openModal(pdfUrl: string): void {
    const dialogRef = this.dialog.open(PdfViewerModalComponent, {
      width: '1400px',
      height: '80%',
      position: {
          top: '',
          left: '20%'
      },
      data: { pdfUrl: pdfUrl },
    });  

  }
  
  selectUser(user: any) {
    const selectedUser = this.filteredUsers.findIndex(u => u.id === user.id);
    this.filteredUsers[selectedUser].unread_messages = 0
    this.apiService.getProfiles().subscribe(
      (data:any) => {
        this.profile = data.find((element) => element.id === user.id_perfil)
      },
      (error) => {
        console.log(error)
      }
    )
    
    this.messages = [];
    this.selectedUser = user;
    this.socket.off('conversation');
    const conversationBody = {
      to: this.selectedUser.id
    }
    this.socket.emit('conversation', conversationBody);
    this.getConversation()
    
  
  }

  
  getConversation(){
    const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
    this.apiService.getConversation(userId ,this.selectedUser.id).subscribe(
      (res:any) => {
        this.messages = []
      res.forEach((message) => {
         const messageType = message.from === userId ? 'sent' : 'received';
         this.messages.push({ text: message.message, type: messageType, date: message.sent_date, isFile: message.type, fileURL:message.filename});
       });
      }
    )
    
  }


  sendMessage() {
    if (this.newMessageText.trim() !== ''  && this.selectedUser) {
      const messagePayload = {
        file:null,
        content: {
          to: this.selectedUser.id,  
          mensaje: this.newMessageText.trim(),
          fecha_envio: Date.now()
        }
      };
      this.socket.emit('message', messagePayload);
      this.messages.push({ text: this.newMessageText.trim(), type: 'sent', date: new Date (Date.now()), isFile:'text' });
      this.newMessageText = '';
      this.scrollToBottom();
    }
  }
  

  ffilterUsers() {
    this.filteredUsers = this.users.filter(user => user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  checkIsTyping() {
    this.isTyping = this.newMessageText.trim() !== '';    
    if (this.isTyping) {
      this.socket.emit('typing', { to: this.selectedUser.id });
    } else {
      this.socket.emit('stoptyping', { to: this.selectedUser.id });
    }
  }

  handleScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
  
    this.userScrollingUp = !atBottom;
  }
  
  

  private scrollToBottom(): void {
    try {
      if (this.messageContainer && !this.userScrollingUp) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
  
  isFechaNueva(message: any) {
    const fechaNuevaIndex = this.messages.findIndex((element) => element === message);

    if (fechaNuevaIndex > 0) {
        const fechaNueva = new Date(message.date);
        const fechaAnterior = new Date(this.messages[fechaNuevaIndex - 1].date);

        // Convertir las fechas a cadenas de texto solo con la fecha (YYYY-MM-DD)
        const fechaNuevaStr = fechaNueva.toISOString().split('T')[0];
        const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];

        // Comparar solo las fechas
        if (fechaNuevaStr > fechaAnteriorStr) {
            return true;
        } else {
            return false;
        }
    } else {
        return false; // Si no se encuentra la fecha en el array, retornar falso
    }
}

  toggleChat(){
    this.openChat = true
  }
}
