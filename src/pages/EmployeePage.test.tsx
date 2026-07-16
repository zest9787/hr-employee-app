import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeePage } from "./EmployeePage";
import { QueryProvider } from "../app/providers/QueryProvider";

test("검색 버튼 클릭 전에는 안내 상태만 표시되고 초기화가 가능하다", async () => {
  render(<QueryProvider><EmployeePage /></QueryProvider>);
  expect(screen.getByText("사원관리")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "초기화" }));
});
