import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../shared/services';
import { ChatConfig, ServiceObjective } from '../../shared/models';
import { FALLBACK_CHAT_CONFIG, SERVICE_OBJECTIVES } from '../../shared/constants';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  objectives: ServiceObjective[] = SERVICE_OBJECTIVES;
  chatConfig: ChatConfig = FALLBACK_CHAT_CONFIG;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((cfg) => (this.chatConfig = cfg));
  }
}
