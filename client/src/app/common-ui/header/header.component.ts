import { Component } from '@angular/core';
import { StandartComponent } from './standart/standart.component';
import { BurgerComponent } from './burger/burger.component';
import { MobileComponent } from './mobile/mobile.component';
import { MobileNavbarComponent } from './mobile-navbar/mobile-navbar.component';

@Component({
  selector: 'app-header',
  imports: [
    StandartComponent,
    BurgerComponent,
    MobileComponent,
    MobileNavbarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
