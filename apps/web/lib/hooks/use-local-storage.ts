'use client';

import * as React from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value: T | ((prev: T) => T)) {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`useLocalStorage write error for key "${key}":`, error);
    }
  }

  function removeValue() {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`useLocalStorage remove error for key "${key}":`, error);
    }
  }

  return [storedValue, setValue, removeValue] as const;
}
