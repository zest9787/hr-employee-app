import { Space } from "antd";
import { useState } from "react";
import { EmployeeDetailView } from "../features/employee/EmployeeDetailView";
import { EmployeeFormView } from "../features/employee/EmployeeFormView";
import { EmployeeListView } from "../features/employee/EmployeeListView";
import type { EmployeeListState } from "../features/employee/EmployeeListView";

const initialEmployeeListState: EmployeeListState = {
  formValues: {},
  searchParams: import.meta.env.VITE_ENABLE_MOCK === "true" ? {} : null,
  page: { page: 0, size: 20 },
};

type EmployeePageMode =
  | { type: "list" }
  | { type: "detail"; employeeId: string }
  | { type: "create" }
  | { type: "edit"; employeeId: string };

export function EmployeePage() {
  const [pageMode, setPageMode] = useState<EmployeePageMode>({ type: "list" });
  const [employeeListState, setEmployeeListState] = useState<EmployeeListState>(
    initialEmployeeListState,
  );

  return (
    <Space
      direction="vertical"
      size={16}
      style={{
        width: "100%",
        padding: 28,
        background: "#f4f6fa",
        minHeight: "100vh",
      }}
    >
      {pageMode.type === "detail" && (
        <EmployeeDetailView
          employeeId={pageMode.employeeId}
          onBack={() => setPageMode({ type: "list" })}
        />
      )}
      {pageMode.type === "create" && (
        <EmployeeFormView
          mode="create"
          onBack={() => setPageMode({ type: "list" })}
        />
      )}
      {pageMode.type === "edit" && (
        <EmployeeFormView
          mode="edit"
          employeeId={pageMode.employeeId}
          onBack={() => setPageMode({ type: "list" })}
        />
      )}
      {pageMode.type === "list" && (
        <EmployeeListView
          state={employeeListState}
          onStateChange={setEmployeeListState}
          onSelectEmployee={(employeeId) =>
            setPageMode({ type: "detail", employeeId })
          }
          onCreateEmployee={() => setPageMode({ type: "create" })}
          onEditEmployee={(employeeId) =>
            setPageMode({ type: "edit", employeeId })
          }
        />
      )}
    </Space>
  );
}
