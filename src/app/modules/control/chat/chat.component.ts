
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ApiService } from 'src/app/shared/services/api.service';
import { PdfViewerModalComponent } from './pdf-viewer-modal/pdf-viewer-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  newMessageText: string = '';
  messages: { text: string, type: 'sent' | 'received', date:number, isFile:string, fileURL?:string }[] = [];
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  private socket: Socket; 
  searchTerm: string = '';
  users: any[] = []; 
  filteredUsers: any[] = []; 
  selectedUser: any | null = null;
  isSelectedUser: (user: any) => boolean = (user) => false; // Inicializar la función de selección de usuario
  isTyping: boolean = false;
  profile: any
  me_user: ''
  scrolledToBottom: boolean = true;

  constructor(private apiService: ApiService, private dialog: MatDialog) {
    this.scrolledToBottom = true
    const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
    const me = apiService.getWholeUser()
    this.me_user = me.nombre
    
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
      this.messages.push({ text: data.content.mensaje, type: 'received', date: data.content.fecha_envio, isFile: data.content.type });   
      this.scrolledToBottom = true   
    });  

    this.socket.on('message-sent', (data) => {  
      this.messages[this.messages.length-1].fileURL = data.message.filename
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
    this.getUnread("3")
  }

  ngAfterViewChecked(): void {
    if(this.scrolledToBottom && this.messages.length > 0){
      this.scrollToBottom()
      this.scrolledToBottom = false
    }
  }


  handleFileInput(event: any): void {
    const file = event.target.files[0];
    console.log(file)
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

      let fileURL = '';
      if (navigator.userAgent.includes('WebKit')) {
        fileURL = file.getWebkitRelativePath() || '';
      } else if (navigator.userAgent.includes('Firefox')) {
        fileURL = file.mozFullPath || '';
      }
      this.socket.emit('message', messagePayload);
      this.messages.push({ text: this.newMessageText.trim(), type: 'sent', date: Date.now(), isFile:'file', fileURL: fileURL });
      this.scrolledToBottom = true
      this.newMessageText = '';
    }
}


  
  getUsers() {
    const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data.result.map(user => ({ ...user, isTyping: false }));
        this.users = this.users.filter(user => user.id !== userId);
        this.filteredUsers = this.users;

        if (this.users.length > 0 && !this.selectedUser) {
          this.selectedUser = this.users[0];
          this.selectUser(this.selectedUser);
          this.getConversation()
          // this.socket.off('conversation');
          // const conversationBody = {
          //   to: this.selectedUser.id
          // };
          // this.socket.emit('conversation', conversationBody);
          // this.socket.on('conversation', (messageData) => {  
          //   this.messages = []
          //   messageData.forEach((message) => {
          //     const messageType = message.from === userId ? 'sent' : 'received';
          //     this.messages.push({ text: message.message, type: messageType, date: message.sent_date, isFile: message.type, fileURL:message.filename});
          //   });
          // });
        }
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
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

  getUnread(id:string){
    //const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
    this.apiService.getUnread("2",id.toString()).subscribe(
      (res:any) => {
        return res.amount
      },
      (error: any) => {
        console.log(error)
        return -1
      }
    )
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
    this.isSelectedUser = (u) => u === user; 
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
    //const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
    this.getConversation()
    // this.socket.off('conversation');
    // const conversationBody = {
    //   to: this.selectedUser.id
    // };
    // this.socket.emit('conversation', conversationBody);
    // this.socket.on('conversation', (messageData) => {  
    //   this.messages = []
    //   messageData.forEach((message) => {
    //     const messageType = message.from === userId ? 'sent' : 'received';
    //     this.messages.push({ text: message.message, type: messageType, date: message.sent_date, isFile: message.type, fileURL:message.filename});
    //   });
      this.scrolledToBottom = true
  
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
      this.messages.push({ text: this.newMessageText.trim(), type: 'sent', date: Date.now(), isFile:'text' });
      this.newMessageText = '';
      this.scrolledToBottom = true
    }
  }

  filterUsers() {
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
  

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  isFechaNueva(message: any) {
    const fechaNuevaIndex = this.messages.findIndex((element) => element === message);

    if (fechaNuevaIndex > 0) {
        const fechaNueva = new Date(message.date);
        const fechaAnterior = new Date(this.messages[fechaNuevaIndex - 1].date);

        const fechaNuevaStr = fechaNueva.toISOString().split('T')[0];
        const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];

        if (fechaNuevaStr > fechaAnteriorStr) {
            return true;
        } else {
            return false;
        }
    } else {
        return false; 
    }
}

}