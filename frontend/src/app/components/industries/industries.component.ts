import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INDUSTRY_TAGS, INDUSTRY_MORE_LABEL } from '../../shared/constants';

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent {
  industries: string[] = INDUSTRY_TAGS;
  moreLabel: string = INDUSTRY_MORE_LABEL;
}
