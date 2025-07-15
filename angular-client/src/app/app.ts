import { Component } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'FindMyHorse';
}
