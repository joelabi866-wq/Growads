import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyPoint } from '../../shared/models';
import { WHY_POINTS } from '../../shared/constants';

@Component({
  selector: 'app-why-growads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-growads.component.html',
  styleUrls: ['./why-growads.component.scss']
})
export class WhyGrowadsComponent {
  points: WhyPoint[] = WHY_POINTS;
}
