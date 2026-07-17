import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { min-height: 100%; }
  body {
    margin: 0;
    min-width: 320px;
    background: #f4f6fa;
    color: #172033;
    font-family: Inter, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif;
  }
  .ant-btn { box-shadow: none; }
  .ant-input, .ant-select-selector, .ant-picker { border-color: #dbe3ef !important; }
  .employee-department-tree .ant-tree-treenode {
    align-items: center;
  }
  .employee-department-tree .ant-tree-switcher {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .employee-department-tree .ant-tree-indent-unit {
    width: 14px;
  }
  .employee-department-tree .ant-tree-node-content-wrapper {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding-inline: 2px 4px;
    line-height: 24px;
  }
  .ag-theme-quartz {
    --ag-font-family: Inter, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif;
    --ag-header-background-color: #f8fafc;
    --ag-header-foreground-color: #172033;
    --ag-border-color: #dbe3ef;
    --ag-row-hover-color: #f4f7fc;
    --ag-selected-row-background-color: #eaf1ff;
  }
`;
