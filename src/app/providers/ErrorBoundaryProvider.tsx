import { Result } from "antd";
import type { PropsWithChildren, ReactNode } from "react";
import { Component } from "react";

class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render(): ReactNode {
    if (this.state.hasError) {
      return <Result status="500" title="오류가 발생했습니다" subTitle="잠시 후 다시 시도해 주세요." />;
    }
    return this.props.children;
  }
}

export function ErrorBoundaryProvider({ children }: PropsWithChildren) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
