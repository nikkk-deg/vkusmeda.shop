import { CommonModule } from '@angular/common';
import {
  runInInjectionContext,
  Component,
  Injector,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../data/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { authActions } from '../../data/store/auth/auth.actions';
import {
  selectEmailError,
  selectUser,
} from '../../data/store/auth/auth.selectors';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  email = '';
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  injector = inject(Injector);
  isErrorEmail = this.store.selectSignal(selectEmailError);
  titleService = inject(Title);

  onSubmit() {
    runInInjectionContext(this.injector, () => {
      this.authService.sendEmail(this.email);
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Авторизация');

    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      if (token) {
        this.store.dispatch(authActions.getUser({ token: token }));
      }
    });
  }
}
