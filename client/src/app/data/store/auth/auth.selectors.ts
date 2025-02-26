import { createSelector } from '@ngrx/store';
import { authFeature, AuthState } from './auth.reducer';

export const selectUser = createSelector(
  authFeature.selectAuthFeatureState,
  (state: AuthState) => {
    return state.user;
  }
);

export const selectToken = createSelector(
  authFeature.selectAuthFeatureState,
  (state: AuthState) => {
    return state.token;
  }
);

export const selectUserLoading = createSelector(
  authFeature.selectAuthFeatureState,
  (state: AuthState) => {
    return state.isLoading;
  }
);

export const selectUserError = createSelector(
  authFeature.selectAuthFeatureState,
  (state: AuthState) => {
    return state.isError;
  }
);

export const selectEmailLoading = createSelector(
  authFeature.selectAuthFeatureState,
  (state: AuthState) => {
    return state.isLoadingEmail;
  }
);

export const selectEmailError = createSelector(
  authFeature.selectAuthFeatureState,
  (state: AuthState) => {
    return state.isErrorEmail;
  }
);

export const selectBasket = createSelector(
  authFeature.selectAuthFeatureState,
  (state: AuthState) => {
    return state.basket;
  }
);
