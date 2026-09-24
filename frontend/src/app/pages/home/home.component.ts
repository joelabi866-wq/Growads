import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProofStripComponent } from '../../components/proof-strip/proof-strip.component';
import { IndustriesComponent } from '../../components/industries/industries.component';
import { ServicesComponent } from '../../components/services/services.component';
import { WhyGrowadsComponent } from '../../components/why-growads/why-growads.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { RoadmapComponent } from '../../components/roadmap/roadmap.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { FinalCtaComponent } from '../../components/final-cta/final-cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ProofStripComponent,
    IndustriesComponent,
    ServicesComponent,
    WhyGrowadsComponent,
    TestimonialsComponent,
    RoadmapComponent,
    PricingComponent,
    FaqComponent,
    FinalCtaComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {}
