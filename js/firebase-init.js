import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

const config = window.__FIREBASE_CONFIG__;

if (!config) {
  console.warn(
    "Firebase config missing. Generate js/firebase-config.js from .env before loading this page."
  );
} else {
  const app = initializeApp(config);
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}
