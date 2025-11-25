import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cats-landing-page',
  imports: [],
  templateUrl: './cats-landing-page.html',
  styleUrl: './cats-landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatsLandingPage { }
