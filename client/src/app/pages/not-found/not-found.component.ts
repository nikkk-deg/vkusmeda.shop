import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  router = inject(Router);
  titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('Вкус Мёда');
  }

  moveBack() {
    this.router.navigate(['']);
  }
}
