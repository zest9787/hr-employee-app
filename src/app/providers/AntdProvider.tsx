import { ConfigProvider, theme } from "antd";
import type { PropsWithChildren } from "react";

export function AntdProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#2f5fb3",
          colorInfo: "#2f5fb3",
          colorBgLayout: "#f4f6fa",
          colorText: "#172033",
          colorTextSecondary: "#667085",
          colorBorder: "#dbe3ef",
          borderRadius: 8,
          controlHeight: 36,
          fontFamily:
            'Inter, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif',
        },
        components: {
          Button: { borderRadius: 7, controlHeight: 36, fontWeight: 600 },
          Card: { borderRadiusLG: 8 },
          Layout: { bodyBg: "#f4f6fa", headerBg: "#ffffff", siderBg: "#13213a" },
          Menu: { darkItemSelectedBg: "#2f5fb3" },
          Table: { headerBg: "#f8fafc", headerColor: "#172033" },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
