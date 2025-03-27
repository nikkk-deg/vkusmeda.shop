import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private metaService = inject(Meta);
  private titleService = inject(Title);
  private router = inject(Router);
  r2 = inject(Renderer2);
  platformId = inject(PLATFORM_ID);

  constructor() {
    this.router.events.subscribe(() => {
      this.r2.removeClass(document.body, 'no-scroll');
    });
  }

  setMeta(title: string, description: string) {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          window.scrollTo(0, 0);
        });
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.router.url.split('?')[0]; // Убираем query параметры

        switch (route) {
          case '/about':
            this.setMeta(
              'О магазине «ВкусМёда» – натуральный мёд с лучших пасек',
              'Узнайте больше о магазине «ВкусМёда» – поставщике натурального мёда с проверенных пасек. Мы ценим качество, натуральность и вкус!'
            );
            break;

          case '/auth':
            this.setMeta(
              'Вход в личный кабинет | ВкусМёда',
              'Войдите в личный кабинет, чтобы оформить заказ, отслеживать покупки и получать эксклюзивные предложения на лучший мёд.'
            );
            break;

          case '/basket':
            this.setMeta(
              'Корзина покупок | ВкусМёда',
              'Проверьте свою корзину перед оформлением заказа. Лучший мёд уже ждёт вас – оформите покупку за пару кликов!'
            );
            break;

          case '/main-page':
            this.setMeta(
              'ВкусМёда – магазин натурального мёда с пасеки',
              'Натуральный мёд из экологически чистых регионов. Большой выбор сортов: липовый, гречишный, цветочный и другие. Быстрая доставка по России!'
            );
            break;

          case '/make-order':
            this.setMeta(
              'Оформление заказа | ВкусМёда',
              'Последний шаг перед получением натурального мёда! Заполните данные, выберите способ доставки и ожидайте свежий мёд у себя дома.'
            );
            break;

          case '/not-found':
            this.setMeta(
              'Страница не найдена | ВкусМёда',
              'Упс! Такой страницы нет, но наш мёд по-прежнему доступен. Вернитесь на главную и выберите свой любимый сорт.'
            );
            break;

          case '/order':
            this.setMeta(
              'Детали заказа | ВкусМёда',
              'Просмотрите детали своего заказа: выбранные сорта мёда, адрес доставки и статус выполнения.'
            );
            break;

          case '/orders':
            this.setMeta(
              'История заказов | ВкусМёда',
              'Следите за своими покупками: отслеживайте статусы заказов, повторяйте удачные покупки и наслаждайтесь лучшим мёдом.'
            );
            break;

          case '/products':
            this.setMeta(
              'Каталог натурального мёда | ВкусМёда',
              'Выберите идеальный мёд для себя: липовый, гречишный, цветочный и другие сорта. Натуральный продукт от проверенных пасек!'
            );
            break;
        }
      });
  }
}
