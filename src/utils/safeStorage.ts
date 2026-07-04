class SafeStorage {
  private memoryStorage: Record<string, string> = {};
  private isSupported: boolean;

  constructor() {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        this.isSupported = false;
        return;
      }
      const testKey = "__storage_test__";
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      this.isSupported = true;
    } catch (e) {
      this.isSupported = false;
      console.warn("localStorage is not accessible. Using in-memory fallback storage.", e);
    }
  }

  getItem(key: string): string | null {
    if (this.isSupported) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return this.memoryStorage[key] || null;
      }
    }
    return this.memoryStorage[key] || null;
  }

  setItem(key: string, value: string): void {
    if (this.isSupported) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn("Error setting item in localStorage:", e);
      }
    }
    this.memoryStorage[key] = String(value);
  }

  removeItem(key: string): void {
    if (this.isSupported) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn("Error removing item from localStorage:", e);
      }
    }
    delete this.memoryStorage[key];
  }

  clear(): void {
    if (this.isSupported) {
      try {
        window.localStorage.clear();
        return;
      } catch (e) {
        console.warn("Error clearing localStorage:", e);
      }
    }
    this.memoryStorage = {};
  }
}

export const safeLocalStorage = new SafeStorage();
