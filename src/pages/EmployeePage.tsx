import { Space } from "antd";
import { useState } from "react";
import { EmployeeDetailView } from "../features/employee/EmployeeDetailView";
import { EmployeeListView } from "../features/employee/EmployeeListView";
import type { EmployeeListState } from "../features/employee/EmployeeListView";

const initialEmployeeListState: EmployeeListState = {
  formValues: {},
  searchParams: import.meta.env.VITE_ENABLE_MOCK === "true" ? {} : null,
  page: { page: 0, size: 20 },
};

export function EmployeePage() {
  const [detailEmployeeId, setDetailEmployeeId] = useState<string>();
  const [employeeListState, setEmployeeListState] = useState<EmployeeListState>(initialEmployeeListState);

  return (
    <Space direction="vertical" size={16} style={{ width: "100%", padding: 28, background: "#f4f6fa", minHeight: "100vh" }}>
      {detailEmployeeId ? (
        <EmployeeDetailView employeeId={detailEmployeeId} onBack={() => setDetailEmployeeId(undefined)} />
      ) : (
        <EmployeeListView
          state={employeeListState}
          onStateChange={setEmployeeListState}
          onSelectEmployee={setDetailEmployeeId}
        />
      )}
    </Space>
  );
}
