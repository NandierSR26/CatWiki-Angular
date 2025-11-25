import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './modules/ui/components/header/header';
import { Footer } from './modules/ui/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('catwiki-app');
}
