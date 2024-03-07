
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
  messages: { text: string, type: 'sent' | 'received', date:number, isFile:string, fileURL?:string }[] = [];
  @ViewChild('messageContainer') private messageContainer: ElementRef;
  private socket: Socket; 
  searchTerm: string = '';
  users: any[] = []; 
  filteredUsers: any[] = []; 
  selectedUser: any | null = null;
  isTyping: boolean = false;
  profile: any
  me_user: ''

  constructor(private apiService: ApiService) {
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

    if (file) {
      // Obtener la extensión del archivo
      const fileNameParts = file.name.split('.');
      const extension = fileNameParts[fileNameParts.length - 1];

      const messagePayload = {
        file: file,
        content: {
          to: this.selectedUser.id,  
          mensaje: '',
          fecha_envio: Date.now(),
          type: 'file',
          extension: extension // Añadir la extensión al payload del mensaje
        }
      };

      // Detectar el navegador y obtener la ruta local del archivo seleccionado
      let fileURL = '';
      if (navigator.userAgent.includes('WebKit')) {
        // Navegador basado en WebKit (Safari, Chrome, etc.)
        fileURL = file.getWebkitRelativePath() || '';
      } else if (navigator.userAgent.includes('Firefox')) {
        // Navegador Mozilla (Firefox)
        fileURL = file.mozFullPath || '';
      }
      console.log(fileURL)
      this.socket.emit('message', messagePayload);
      this.messages.push({ text: this.newMessageText.trim(), type: 'sent', date: Date.now(), isFile:'file', fileURL: fileURL });
      this.newMessageText = '';
    }
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
    this.apiService.getProfiles().subscribe(
      (data:any) => {
        this.profile = data.find((element) => element.id === user.id_perfil)
        console.log(data)
      },
      (error) => {
        console.log(error)
      }
    )

    this.messages = [];
    console.log(user)
    this.selectedUser = user;
    const userId = JSON.parse(localStorage.getItem('token_escudo')).id;
  
    this.socket.off('conversation');
  
    const conversationBody = {
      to: this.selectedUser.id
    };
    this.socket.emit('conversation', conversationBody);
  
    this.socket.on('conversation', (messageData) => {  
      console.log(messageData)
      messageData.forEach((message) => {
        const messageType = message.from === userId ? 'sent' : 'received';
        this.messages.push({ text: message.message, type: messageType, date: message.sent_date, isFile: message.type, fileURL:message.filename});
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

}