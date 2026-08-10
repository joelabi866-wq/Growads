import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../shared/services';
import { ChatConfig, Platform } from '../../shared/models';
import { FALLBACK_CHAT_CONFIG, PLATFORMS } from '../../shared/constants';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  platforms: Platform[] = PLATFORMS;
  chatConfig: ChatConfig = FALLBACK_CHAT_CONFIG;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((cfg) => (this.chatConfig = cfg));
  }
}
