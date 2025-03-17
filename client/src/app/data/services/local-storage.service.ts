import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem(key: string, value: any): void {
    try {
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getItem<T>(key: string) {
    try {
      if (typeof window !== 'undefined' && localStorage) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.clear();
    }
  }
}
