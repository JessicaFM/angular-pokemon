import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-pokemon';
}
