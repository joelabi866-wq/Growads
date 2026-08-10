import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../shared/models';
import { TESTIMONIALS } from '../../shared/constants';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = TESTIMONIALS;

  initials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
