import { Component, inject } from '@angular/core';
import { AuthService } from '../../data/services/auth.service';
import { StandartComponent } from './standart/standart.component';

@Component({
  selector: 'app-header',
  imports: [StandartComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
