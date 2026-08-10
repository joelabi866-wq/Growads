import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../shared/services';
import { ChatConfig } from '../../shared/models';
import { FALLBACK_CHAT_CONFIG } from '../../shared/constants';
import { AiChatComponent } from '../ai-chat/ai-chat.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, AiChatComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  chatConfig: ChatConfig = FALLBACK_CHAT_CONFIG;
  year = new Date().getFullYear();

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((cfg) => (this.chatConfig = cfg));
  }
}
