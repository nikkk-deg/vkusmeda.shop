import { CookieService } from 'ngx-cookie-service';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectPreOrder } from '../../data/store/order/order.selectors';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectUser } from '../../data/store/auth/auth.selectors';
import { OrderService } from '../../data/services/order.service';
import { ordersActions } from '../../data/store/order/order.actions';
import { authActions } from '../../data/store/auth/auth.actions';
import { BasketService } from '../../data/services/basket.service';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-make-order',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './make-order.component.html',
  styleUrl: './make-order.component.scss',
})
export class MakeOrderComponent {
  store = inject(Store);
  preOrder = this.store.selectSignal(selectPreOrder);
  totalPrice = signal(0);
  router = inject(Router);
  user = signal<any>(null);
  orderService = inject(OrderService);
  cookieService = inject(CookieService);
  basketService = inject(BasketService);
  checked = signal(false);
  titleService = inject(Title);

  ngOnInit() {
    this.titleService.setTitle('Оформление заказа');
  }

  changeChecked() {
    this.checked.set(!this.checked());
  }

  form = new FormGroup({
    name: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl<string>(''),
    text: new FormControl<string>('', Validators.maxLength(200)),
  });

  constructor() {
    effect(() => {
      this.totalPrice.set(
        this.preOrder().reduce(
          (acc, item) => acc + item.productId.price * item.jars,
          0
        )
      );
      if (this.totalPrice() === 0) {
        this.router.navigate(['/basket']);
      }
    });

    effect(() => {
      this.user.set(this.store.selectSignal(selectUser)());
      if (this.user()) {
        const patchForm = {
          email: this.user()!.email,
          name: this.user()!.name,
          phoneNumber: this.user()!.phoneNumber,
          lastName: this.user()!.surname,
        };
        this.form.patchValue(patchForm);
      }
    });
  }

  saveUserData() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;
    this.orderService.saveUser({
      name: this.form.controls.name.value,
      surname: this.form.controls.lastName.value,
      email: this.form.controls.email.value,
      phoneNumber: this.form.controls.phoneNumber.value,
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    if (this.checked()) this.saveUserData();
    //@ts-ignore
    this.orderService.makeOrder(this.form.controls.email.value);
    this.basketService.deleteManyFromBasket(this.preOrder());

    this.store.dispatch(ordersActions.clearPreOrder());
    const token = this.cookieService.get('token');
    this.store.dispatch(authActions.getUser({ token }));
  }
}
// nikita.deki4@gmail.com
