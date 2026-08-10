import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfigService, LeadService } from '../../shared/services';
import { ChatConfig, LeadPayload } from '../../shared/models';
import { FALLBACK_CHAT_CONFIG } from '../../shared/constants';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  chatConfig: ChatConfig = FALLBACK_CHAT_CONFIG;

  lead: LeadPayload = { name: '', email: '', phone: '', business: '' };
  leadStatus: 'idle' | 'sending' | 'ok' | 'error' = 'idle';
  leadMessage = '';

  constructor(private configService: ConfigService, private leadService: LeadService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((cfg) => (this.chatConfig = cfg));
  }

  submitLead(form: NgForm): void {
    // Name, email and phone are all mandatory — surface which one is missing
    // instead of letting the submit button do nothing.
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.leadStatus = 'error';
      this.leadMessage = 'Please fill in your name, email address and phone number.';
      return;
    }

    this.leadStatus = 'sending';
    this.leadMessage = 'Sending…';

    this.leadService.submitLead(this.lead).subscribe({
      next: () => {
        this.leadStatus = 'ok';
        this.leadMessage = "Got it — we'll reach out shortly.";
        this.lead = { name: '', email: '', phone: '', business: '' };
        form.resetForm();
      },
      error: () => {
        this.leadStatus = 'error';
        this.leadMessage = "Couldn't submit right now — message us on WhatsApp instead.";
      }
    });
  }
}
