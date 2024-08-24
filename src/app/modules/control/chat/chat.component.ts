import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { io, Socket } from "socket.io-client";
import { ApiService } from "src/app/shared/services/api.service";
import { PdfViewerModalComponent } from "./pdf-viewer-modal/pdf-viewer-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { Observable, catchError, forkJoin, map, of } from "rxjs";
import { NgZone } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { LOCALE_ID } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  newMessageText: string = "";
  messages: {
    text: string;
    type: "sent" | "received";
    date: Date;
    isFile: string;
    fileURL?: string;
    from?: number;
  }[] = [];
  @ViewChild("messageContainer") private messageContainer!: ElementRef;
  private socket!: Socket;
  searchTerm: string = "";
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any | null = null;
  isSelectedUser: (user: any) => boolean = (user) => false;
  isTyping: boolean = false;
  profile: any;
  me_user: "";
  me_role: "";
  other_role:any;
  userId: any;
  scrolledToBottom: boolean = true;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    const tokenEscudo = localStorage.getItem("token_escudo");

    if (tokenEscudo !== null) {
      this.userId = JSON.parse(tokenEscudo).id;
    } else {
      console.log(
        'El token "token_escudo" no estÃ¡ presente en el almacenamiento local.'
      );
    }

    const me = apiService.getWholeUser();
    console.log(me)
    this.me_user = me.nombre;
    this.me_role = me.perfil.nombre

    if (this.userId !== null) {
      this.socket = io("wss://apief.globalbusiness.com.mx", {
        extraHeaders: {
          id: this.userId,
        },
      });

      this.socket.on("connect", () => {
        console.log("Conectado al servidor de sockets con ID:", this.userId);
      });

      this.socket.on("disconnect", () => {
        this.socket.off("typing");
      });

      this.socket.on("message", (data: any) => {
        let date = new Date(data.content.fecha_envio);
        if (data.content.type !== "file") {
          data.content.type = "text";
        }
        data.content.from = parseInt(data.content.from);
        this.messages.push({
          text: data.content.mensaje,
          type: "received",
          date: date,
          isFile: data.content.type,
          from: data.from,
          fileURL: data.content.filename,
        });
        this.cdr.detectChanges();
        this.scrolledToBottom = true;

        if (data.from != this.selectedUser.id) {
          const unreadObservables = this.users.map((user) =>
            this.getUnread(user.id)
          );
          forkJoin(unreadObservables).subscribe((unreads: any) => {
            unreads.forEach((unread: any, index: any) => {
              this.users[index].unread_messages = unread;
            });

            this.users = this.users.filter((user) => user.id !== this.userId);
            this.filteredUsers = this.users;
          });
        }
      });

      this.socket.on("message-sent", (data: any) => {
        this.messages[this.messages.length - 1].fileURL = data.message.filename;
      });

      this.socket.on("typing", (data: any) => {
        const typingUserId = data.from;
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

      this.socket.on("stoptyping", (data: any) => {
        const typingUserId = data.from;
        let typingUserIndex = -1;
        this.filteredUsers.forEach((element, index) => {
          if (element.id === parseInt(typingUserId)) {
            typingUserIndex = index;
          }
        });
        if (typingUserIndex !== -1) {
          this.filteredUsers[typingUserIndex].isTyping = false;
        }
        if (
          this.selectedUser &&
          this.selectedUser.id === typingUserId.toString()
        ) {
          this.isTyping = true;
        }
      });

      this.socket.on('fileUploadResult', (data:any) => {
        console.log(data)
      })
    }
  }

  private setupSocketListeners() {
    const userId = this.userId;
    this.socket.on("connect", () => {
      console.log("Conectado al servidor de sockets con ID:");
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getUnread("3");
  }

  ngAfterViewChecked(): void {
    if (this.scrolledToBottom && this.messages.length > 0) {
      this.scrollToBottom();
      console.log("a");
      this.scrolledToBottom = false;
    }
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convertir el tamaño del archivo a MB
      if (fileSizeInMB > 25) {
        Swal.fire({
          title: 'El archivo no puede superar los 25 Mb',
          icon: 'error',
        })
        return;
      }
  
      const fileNameParts = file.name.split(".");
      const extension = fileNameParts[fileNameParts.length - 1];
  
      const messagePayload = {
        file: file,
        content: {
          to: this.selectedUser.id,
          mensaje: "",
          fecha_envio: Date.now(),
          type: "file",
          extension: extension,
        },
      };
      this.socket.emit("message", messagePayload, (response:any) => {
        console.log("Respuesta del servidor:", response);
      });
      this.messages.push({
        text: this.newMessageText.trim(),
        type: "sent",
        date: new Date(Date.now()),
        isFile: "file",
      });
      this.scrolledToBottom = true;
      this.newMessageText = "";
    }
  }
  

  getUsers() {
    const userId = this.userId;
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data.result.map((user: any) => ({
          ...user,
          isTyping: false,
        }));
        const unreadObservables = this.users.map((user) =>
          this.getUnread(user.id)
        );

        forkJoin(unreadObservables).subscribe((unreads: any) => {
          unreads.forEach((unread: any, index: any) => {
            this.users[index].unread_messages = unread;
          });

          this.users = this.users.filter((user) => user.id !== userId);
          this.filteredUsers = this.users;

          if (this.users.length > 0 && !this.selectedUser) {
            this.selectedUser = this.users[0];
            this.selectUser(this.selectedUser);
            const conversationBody = {
              to: this.selectedUser.id,
            };
            this.socket.emit("conversation", conversationBody);
            this.getConversation();
          }
        });
      },
      (error: any) => {
        console.error("Error al obtener usuarios:", error);
      }
    );
  }

  getConversation() {
    const userId = this.userId;
    this.apiService
      .getConversation(userId, this.selectedUser.id)
      .subscribe((res: any) => {
        this.messages = [];
        res.forEach((message: any) => {
          const messageType = message.from === userId ? "sent" : "received";
          this.messages.push({
            text: message.message,
            type: messageType,
            date: message.sent_date,
            isFile: message.type,
            fileURL: message.filename,
            from: message.from,
          });
        });
      });
  }

  getUnread(id: string): Observable<number> {
    const userId = this.userId;
    return this.apiService.getUnread(id.toString(), userId).pipe(
      map((res: any) => res.amount),
      catchError((error) => {
        console.error(error);
        return of(-1); // Manejo del error, devolviendo -1
      })
    );
  }

  // openModal(pdfUrl: string): void {
  //   const dialogRef = this.dialog.open(PdfViewerModalComponent, {
  //     width: '1400px',
  //     height: '80%',
  //     position: {
  //         top: '',
  //         left: '20%'
  //     },
  //     data: { pdfUrl: pdfUrl },
  //   });

  // }

  selectUser(user: any) {
    const selectedUser = this.filteredUsers.findIndex((u) => u.id === user.id);
    this.filteredUsers[selectedUser].unread_messages = 0;
    this.isSelectedUser = (u) => u === user;
    this.apiService.getProfiles().subscribe(
      (data: any) => {
        this.profile = data.find(
          (element: any) => element.id === user.id_perfil
        );
      },
      (error: any) => {
        console.log(error);
      }
    );

    this.messages = [];
    this.selectedUser = user;
    this.apiService.getProfiles().subscribe({
      next: res => {
        console.log(res)
        this.other_role = res.find(role => role.id === this.selectedUser.id_perfil)
        console.log(this.other_role)
      }
    })
    const userId = this.userId;
    this.socket.off("conversation");
    const conversationBody = {
      to: this.selectedUser.id,
    };
    this.socket.emit("conversation", conversationBody);
    this.getConversation();
    this.scrolledToBottom = true;
  }

  sendMessage() {
    if (this.newMessageText.trim() !== "" && this.selectedUser) {
      const messagePayload = {
        file: null,
        content: {
          to: this.selectedUser.id,
          mensaje: this.newMessageText.trim(),
          fecha_envio: Date.now(),
        },
      };
      this.socket.emit("message", messagePayload, (response:any) => {
        console.log('Respuesta', response)
      });
      this.messages.push({
        text: this.newMessageText.trim(),
        type: "sent",
        date: new Date(Date.now()),
        isFile: "text",
      });
      this.newMessageText = "";
      this.scrolledToBottom = true;
    }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter((user) =>
      user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  checkIsTyping() {
    this.isTyping = this.newMessageText.trim() !== "";
    if (this.isTyping) {
      this.socket.emit("typing", { to: this.selectedUser.id });
    } else {
      this.socket.emit("stoptyping", { to: this.selectedUser.id });
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  isFechaNueva(message: any) {
    const fechaNuevaIndex = this.messages.findIndex(
      (element) => element === message
    );

    if (fechaNuevaIndex > 0) {
      const fechaNueva = new Date(message.date);
      const fechaAnterior = new Date(this.messages[fechaNuevaIndex - 1].date);

      const fechaNuevaStr = fechaNueva.toISOString().split("T")[0];
      const fechaAnteriorStr = fechaAnterior.toISOString().split("T")[0];

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
