import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkoutListComponent } from './workout/workout-list/workout-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WorkoutListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'progressive-overload-app';
}
