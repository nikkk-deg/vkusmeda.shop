import { createFeature, createReducer, on } from '@ngrx/store';
import { UserInterface } from '../../interfaces/user.interface';
import { authActions } from './auth.actions';

export interface AuthState {
  user: UserInterface | null;
  error: string | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean;
  isLoadingEmail: boolean;
  isErrorEmail: boolean;
}

export const initialState: AuthState = {
  user: null,
  error: null,
  token: null,
  isLoading: false,
  isError: false,
  isLoadingEmail: false,
  isErrorEmail: false,
};

export const authFeature = createFeature({
  name: 'authFeature',
  reducer: createReducer(
    initialState,
    on(authActions.getUser, (state, { token }) => ({ ...state, token })),
    //@ts-ignore
    on(authActions.getUserSuccess, (state, payload) => {
      return { ...state, user: payload.user };
    }),
    on(authActions.logoutUser, () => {
      return {
        ...initialState,
      };
    }),
    on(authActions.loadUser, (state) => ({ ...state, isLoading: true })),
    on(authActions.errorUser, (state) => ({ ...state, isError: true })),
    on(authActions.completeUser, (state) => ({
      ...state,
      isError: false,
      isLoading: false,
    })),
    on(authActions.loadEmail, (state) => ({ ...state, isLoadingEmail: true })),
    on(authActions.errorEmail, (state) => ({
      ...state,
      isLoadingEmail: false,
      isErrorEmail: true,
    })),
    on(authActions.completeEmail, (state) => ({
      ...state,
      isLoadingEmail: false,
      isErrorEmail: false,
    }))
  ),
});
