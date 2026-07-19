import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCK !== "true") return;
  try {
    const expectedScope = new URL(import.meta.env.BASE_URL, window.location.origin).href;
    const registrations = await navigator.serviceWorker?.getRegistrations?.();
    await Promise.all(
      registrations
        ?.filter(
          (registration) =>
            registration.active?.scriptURL.endsWith("/mockServiceWorker.js") && registration.scope !== expectedScope,
        )
        .map((registration) => registration.unregister()) ?? [],
    );

    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js`, options: { scope: import.meta.env.BASE_URL } },
    });
    console.info("[MSW] employee mock worker enabled");
  } catch (error) {
    console.error("[MSW] employee mock worker failed", error);
  }
}

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
