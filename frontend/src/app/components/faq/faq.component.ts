import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqEntry } from '../../shared/models';
import { FAQS } from '../../shared/constants';
import { FaqItemComponent } from './faq-item.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FaqItemComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  faqs: FaqEntry[] = FAQS;
}
