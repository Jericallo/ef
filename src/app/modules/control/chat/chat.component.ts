import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  newMessageText: string = '';
  messages: { text: string, sent: boolean }[] = [];
  @ViewChild('messageContainer') private messageContainer: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessageText.trim() !== '') {
      this.messages.push({ text: this.newMessageText.trim(), sent: true });
      this.newMessageText = '';
    }
  }
  

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
