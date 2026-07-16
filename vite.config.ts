import { defineConfig, loadEnv } from "vite";
import { createReactAppConfig } from "@company/hr-common-config/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return createReactAppConfig({
    appName: "hr-employee-app",
    basePath: "/employee/",
    port: 3101,
    apiProxyTarget: env.VITE_API_PROXY_TARGET,
    overrides: {
      build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: mode !== "production",
        target: "es2020",
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1500,
      },
      define: {
        __APP_NAME__: JSON.stringify("hr-employee-app"),
      },
    },
  });
});
