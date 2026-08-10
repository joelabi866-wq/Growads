import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../shared/services';
import { ChatConfig } from '../../shared/models';
import { FALLBACK_CHAT_CONFIG } from '../../shared/constants';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-cta.component.html',
  styleUrls: ['./final-cta.component.scss']
})
export class FinalCtaComponent implements OnInit {
  chatConfig: ChatConfig = FALLBACK_CHAT_CONFIG;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((cfg) => (this.chatConfig = cfg));
  }
}
