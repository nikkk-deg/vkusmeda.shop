import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class OrderEffects {
  actions$ = inject(Actions);
  store = inject(Store);
}
