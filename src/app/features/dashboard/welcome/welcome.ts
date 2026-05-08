import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class Welcome {
  constructor(private router: Router) {}

  logout() {
    // In a real app, you would clear tokens here
    this.router.navigate(['/login']);
  }
}
