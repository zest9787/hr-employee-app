import { CommonResult } from "@company/hr-common-ui";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EmployeeSearchCollapseBoxSamplePage } from "../pages/EmployeeSearchCollapseBoxSamplePage";
import { EmployeePage } from "../pages/EmployeePage";
import { MultiEmployeeSearchSamplePage } from "../pages/MultiEmployeeSearchSamplePage";

const router = createBrowserRouter(
  [
    { path: "/", element: <EmployeePage /> },
    { path: "/multi-search-sample", element: <MultiEmployeeSearchSamplePage /> },
    { path: "/search-collapse-sample", element: <EmployeeSearchCollapseBoxSamplePage /> },
    {
      path: "*",
      element: (
        <CommonResult status="404" title={"\uD398\uC774\uC9C0\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4"} />
      ),
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
