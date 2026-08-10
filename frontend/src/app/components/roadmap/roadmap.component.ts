import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../shared/services';
import { ChatConfig, RoadmapPhase } from '../../shared/models';
import { FALLBACK_CHAT_CONFIG, ROADMAP_PHASES } from '../../shared/constants';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {
  phases: RoadmapPhase[] = ROADMAP_PHASES;
  chatConfig: ChatConfig = FALLBACK_CHAT_CONFIG;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((cfg) => (this.chatConfig = cfg));
  }
}
