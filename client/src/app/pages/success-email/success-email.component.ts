import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-email',
  imports: [],
  templateUrl: './success-email.component.html',
  styleUrl: './success-email.component.scss',
})
export class SuccessEmailComponent {
  router = inject(Router);
  titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('Вкус Мёда');
  }

  moveBack() {
    this.router.navigate(['']);
  }
}
