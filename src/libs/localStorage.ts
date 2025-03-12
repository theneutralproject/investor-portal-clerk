import Logger from './logger';

/**
 * Utility for interacting with localStorage safely.
 */
export const localStorageHandler = {
  /**
   * Retrieves a value from localStorage.
   *
   * @param {string} key - The key of the stored value.
   * @returns {string | null} The retrieved value or `null` if unavailable.
   */
  get: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      Logger.warn(`Error accessing localStorage: ${error}`);
      return null;
    }
  },

  /**
   * Stores or removes a value in localStorage.
   *
   * @param {string} key - The key under which to store the value.
   * @param {string | null} value - The value to store; if `null`, removes the key.
   */
  set: (key: string, value: string | null): void => {
    try {
      if (value !== null) {
        window.localStorage.setItem(key, value);
      } else {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      Logger.warn(`localStorage is not available: ${error}`);
    }
  },
};

export const TERMS_CACHE_KEY = 'neutral-terms';
export const USER_CACHE_KEY = 'neutral-user';
export const REDIRECT_URL_KEY = 'neutral-redirect-url';
