type HapticType = "light" | "medium" | "heavy" | "rigid" | "soft";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  themeParams?: Record<string, string>;
  HapticFeedback?: {
    impactOccurred: (type: HapticType) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const telegram = {
  get app() {
    return window.Telegram?.WebApp;
  },
  init() {
    const app = window.Telegram?.WebApp;
    if (!app) return { isTelegram: false, theme: {} };
    app.ready();
    app.expand();
    return { isTelegram: true, theme: app.themeParams ?? {} };
  },
  impact(type: HapticType = "light") {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type);
  },
  success() {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
  },
};
