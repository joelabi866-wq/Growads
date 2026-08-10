import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProofItem } from '../../shared/models';
import { PROOF_ITEMS } from '../../shared/constants';

@Component({
  selector: 'app-proof-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proof-strip.component.html',
  styleUrls: ['./proof-strip.component.scss']
})
export class ProofStripComponent {
  items: ProofItem[] = PROOF_ITEMS;
}
