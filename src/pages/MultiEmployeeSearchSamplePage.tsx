import type { ColDef } from "@ag-grid-community/core";
import { AgGridWrapper, MultiEmployeeSearchModal, PageHeader } from "@company/hr-common-ui";
import type { EmployeeSearchRow } from "@company/hr-common-ui";
import { Button, Card, Space, Typography } from "antd";
import { useMemo, useState } from "react";
import { employeeSearchApi } from "../features/employee/employeeSearchApi";

export function MultiEmployeeSearchSamplePage() {
  const [open, setOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeSearchRow[]>([]);

  const columns = useMemo<ColDef<EmployeeSearchRow>[]>(
    () => [
      { field: "employeeNo", headerName: "사원번호", width: 130 },
      { field: "name", headerName: "사원명", width: 130 },
      { field: "departmentName", headerName: "부서", flex: 1 },
      { field: "positionName", headerName: "직위", width: 120 },
    ],
    [],
  );

  return (
    <Space direction="vertical" size={16} style={{ width: "100%", padding: 28, background: "#f4f6fa", minHeight: "100vh" }}>
      <PageHeader
        title="다중 사원 검색 샘플"
        description="MultiEmployeeSearchModal을 사용해 여러 사원을 선택하고 배열로 결과를 받는 샘플 화면입니다."
        actions={
          <Button type="primary" onClick={() => setOpen(true)}>
            사원 다중 선택
          </Button>
        }
      />

      <Card
        size="small"
        style={{ borderColor: "#dbe3ef", borderRadius: 8 }}
        styles={{ body: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 } }}
      >
        <Typography.Text style={{ color: "#667085", fontSize: 13 }}>
          선택된 사용자 {selectedEmployees.length}명
        </Typography.Text>
        <Space>
          <Button onClick={() => setSelectedEmployees([])} disabled={!selectedEmployees.length}>
            전체 제거
          </Button>
          <Button type="primary" onClick={() => setOpen(true)}>
            다시 선택
          </Button>
        </Space>
      </Card>

      <AgGridWrapper columnDefs={columns} rowData={selectedEmployees} />

      <MultiEmployeeSearchModal
        open={open}
        api={employeeSearchApi}
        value={selectedEmployees}
        onCancel={() => setOpen(false)}
        onSelect={(employees) => {
          setSelectedEmployees(employees);
          setOpen(false);
        }}
      />
    </Space>
  );
}
