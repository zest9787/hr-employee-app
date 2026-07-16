import { AppRouter } from "./router";
import { AntdProvider } from "./providers/AntdProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ErrorBoundaryProvider } from "./providers/ErrorBoundaryProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { GlobalStyle } from "./styles/global";

export function App() {
  return (
    <ErrorBoundaryProvider>
      <QueryProvider>
        <AuthProvider>
          <AntdProvider>
            <GlobalStyle />
            <AppRouter />
          </AntdProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundaryProvider>
  );
}
