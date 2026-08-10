import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../shared/services/chat.service';
import { ChatMessage } from '../../shared/models';

const GREETING =
  "Hi! I'm the GrowAds assistant. Ask me about the platforms we run, how onboarding works, or what happens in your first month.";

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements AfterViewChecked {
  @ViewChild('scroller') scroller?: ElementRef<HTMLDivElement>;
  @ViewChild('field') field?: ElementRef<HTMLTextAreaElement>;

  open = false;
  loading = false;
  error = '';
  draft = '';

  /** The greeting is local so the very first request still costs one turn, not two. */
  messages: ChatMessage[] = [{ role: 'assistant', content: GREETING }];

  readonly suggestions = [
    'Which platform fits my business?',
    'How does the first month work?',
    'Do you take high-risk niches?'
  ];

  private shouldScroll = false;

  constructor(private chat: ChatService) {}

  get started(): boolean {
    return this.messages.length > 1;
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.shouldScroll = true;
      setTimeout(() => this.field?.nativeElement.focus(), 120);
    }
  }

  close(): void {
    this.open = false;
  }

  ask(text: string): void {
    this.draft = text;
    this.send();
  }

  send(): void {
    const text = this.draft.trim();
    if (!text || this.loading) return;

    this.messages = [...this.messages, { role: 'user', content: text.slice(0, 1500) }];
    this.draft = '';
    this.error = '';
    this.loading = true;
    this.shouldScroll = true;

    this.chat.send(this.messages).subscribe({
      next: res => {
        this.messages = [...this.messages, { role: 'assistant', content: res.reply }];
        this.loading = false;
        this.shouldScroll = true;
      },
      error: err => {
        this.loading = false;
        this.error =
          err?.error?.detail ||
          "Something went wrong on our side. Try again, or message us on WhatsApp and a human will pick it up.";
        this.shouldScroll = true;
      }
    });
  }

  onEnter(event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.shiftKey) return; // Shift+Enter keeps the newline
    ke.preventDefault();
    this.send();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.scroller) {
      const el = this.scroller.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }
}
