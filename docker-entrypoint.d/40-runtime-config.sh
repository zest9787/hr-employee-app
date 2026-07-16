#!/usr/bin/env sh
cat > /usr/share/nginx/html/employee/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL:-/api}",
  AUTH_BASE_URL: "${AUTH_BASE_URL:-/api/auth}",
  APP_NAME: "hr-employee-app"
};
EOF
