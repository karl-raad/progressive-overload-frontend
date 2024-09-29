import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ExerciseListComponent,
    MatToolbarModule,
    MatButtonModule,
    ThemeToggleComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'progressive-overload-app';
}
