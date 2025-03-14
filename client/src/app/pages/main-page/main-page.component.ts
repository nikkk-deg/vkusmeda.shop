import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [RouterLink],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  router = inject(Router);
  titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('Вкус мёда');
  }

  navigateToProducts = () => {
    this.router.navigate(['/products']);
  };
}
