import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('О нас');
  }
  techList = [
    { pict: '/assets/svg/nest-icon.svg', text: 'NestJS - backend' },
    { pict: '/assets/svg/angular-icon.svg', text: 'Angular - frontend' },
    {
      pict: '/assets/svg/mongo-icon.svg',
      text: 'MongoDB Atlas - облачная база данных',
    },
    {
      pict: '/assets/svg/passportJS-icon.svg',
      text: 'PassportJS - авторизация по JWT',
    },
    {
      pict: '/assets/svg/docker-icon.svg',
      text: 'Docker - конейнеризация проекта',
    },
    {
      pict: '/assets/svg/ngnix-icon.svg',
      text: 'Nginx - конфигурация для VPS сервера,',
    },
  ];
}
