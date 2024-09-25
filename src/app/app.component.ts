import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkoutListComponent } from './workout/workout-list/workout-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WorkoutListComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'progressive-overload-app';
}
