import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ExerciseListComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'progressive-overload-app';
}
