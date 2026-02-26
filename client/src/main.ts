import { mount } from "svelte";
import App from "./App.svelte";
import { registerSW } from "virtual:pwa-register";

// Register service worker for PWA support
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("New content available, please refresh.");
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

mount(App, {
  target: document.getElementById("app")!,
});
