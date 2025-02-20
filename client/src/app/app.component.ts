import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent, map, Observable, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
