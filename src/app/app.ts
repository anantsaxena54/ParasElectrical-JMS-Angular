import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('JMS-Frontend');

  constructor(public router: Router) {}

  logout() {
    localStorage.removeItem('user'); // Basic cleanup
    this.router.navigate(['/login']);
  }
}
