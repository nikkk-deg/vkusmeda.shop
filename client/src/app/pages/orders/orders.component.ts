import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../data/store/auth/auth.selectors';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
}
