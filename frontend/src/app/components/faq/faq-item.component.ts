import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-item.component.html',
  styleUrls: ['./faq-item.component.scss']
})
export class FaqItemComponent {
  @Input({ required: true }) question!: string;
  @Input({ required: true }) answer!: string;

  open = false;

  toggle(): void {
    this.open = !this.open;
  }
}
