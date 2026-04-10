import { useState, useCallback } from 'react';

const PREFIX = 'chess-mastery:';

export function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem(prefixedKey, JSON.stringify(newValue));
      } catch { /* quota exceeded */ }
      return newValue;
    });
  }, [prefixedKey]);

  return [storedValue, setValue];
}

export function getStorageItem(key, fallback = null) {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch { /* quota exceeded */ }
}
