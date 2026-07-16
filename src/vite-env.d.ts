/// <reference types="vite/client" />

interface Window {
  __RUNTIME_CONFIG__?: {
    API_BASE_URL?: string;
    AUTH_BASE_URL?: string;
    APP_NAME?: string;
  };
}

declare module "msw";
declare module "msw/browser";
