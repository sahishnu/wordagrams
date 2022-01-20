export const LocalStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    } else {
      return null;
    }
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    } else {
      return null;
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    } else {
      null;
    }
  },
  clear: () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    } else {
      null;
    }
  }
}