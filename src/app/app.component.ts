import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ExerciseListComponent,
    MatToolbarModule,
    MatButtonModule,
    ThemeToggleComponent,
    RouterModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'progressive-overload-app';
  activeRoute: string | null = null;
  toggledRoute: string | null = null;

  constructor(private router: Router) {
    // Subscribe to router events to update the active route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.url;
      });
  }
  ngOnInit(): void {
    this.toggle('/exercise-list');
  }

  toggle(route: string) {
    this.toggledRoute = this.toggledRoute === route ? null : route;
  }

  isToggled(route: string): boolean {
    return this.toggledRoute === route;
  }
}
