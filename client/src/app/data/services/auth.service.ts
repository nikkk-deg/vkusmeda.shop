import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserInterface } from '../interfaces/user.interface';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, tap, catchError, EMPTY, finalize, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { authActions } from '../store/auth/auth.actions';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  apiUrl = `${environment.apiUrl}auth`;
  router = inject(Router);
  products = signal<UserInterface | null>(null);
  cookieService = inject(CookieService);
  store = inject(Store);

  sendEmail(email: string) {
    this.store.dispatch(authActions.loadEmail());
    return this.#http
      .post(`${this.apiUrl}/auth`, { email: email })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['/success']);
          this.store.dispatch(authActions.completeEmail());
        },
        error: (error) => {
          this.store.dispatch(authActions.errorEmail());
          setTimeout(() => {
            this.store.dispatch(authActions.completeEmail());
          }, 1500);
          console.error(`Error in send email request - \n ${error}`);
        },
      });
  }

  getUser(token: string | null): Observable<UserInterface | null> {
    if (!token) {
      console.warn('JWT is missing');
      return of(null);
    }
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    this.store.dispatch(authActions.loadUser());
    return this.#http.get<UserInterface>(this.apiUrl, headers).pipe(
      take(1),
      tap(() => {
        this.cookieService.set('token', token);
        const currentLink = this.router.url;

        this.store.dispatch(authActions.completeUser());
        if (currentLink.includes('auth')) {
          this.router.navigate(['/orders']);
        }
        if (typeof window !== 'undefined' && sessionStorage) {
          if (typeof window !== 'undefined' && sessionStorage) {
            sessionStorage.clear();
          }
        }
      }),

      catchError((error) => {
        if (error.status === 401) {
          this.cookieService.deleteAll();
          this.router.navigate(['']);
        }
        this.store.dispatch(authActions.errorUser());
        setTimeout(() => {
          this.store.dispatch(authActions.completeUser());
        }, 2000);
        console.error(`Error in auth request - \n ${error}`);
        return EMPTY;
      })
    );
  }

  logout() {
    this.cookieService.deleteAll();
    this.store.dispatch(authActions.logoutUser());
    if (typeof window !== 'undefined' && sessionStorage) {
      sessionStorage.clear();
    }
    this.router.navigate(['']);
  }
}
