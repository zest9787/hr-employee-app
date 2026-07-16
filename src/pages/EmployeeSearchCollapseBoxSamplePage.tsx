import { EmployeeSearchCollapseBox, PageHeader } from "@company/hr-common-ui";
import type { EmployeeSearchRow } from "@company/hr-common-ui";
import { Card, Descriptions, Empty, Space } from "antd";
import { useState } from "react";
import { employeeSearchApi } from "../features/employee/employeeSearchApi";

export function EmployeeSearchCollapseBoxSamplePage() {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSearchRow>();

  const handleSelect = (employee: EmployeeSearchRow) => {
    setSelectedEmployee(employee);
    console.log("선택된 사원:", employee);
  };

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
      <PageHeader
        title="접힘형 사원 검색 샘플"
        description="페이지 상단에서 펼쳐진 사원 검색 박스를 사용하고, 하단 토글로 접거나 펼치는 샘플입니다."
      />

      <EmployeeSearchCollapseBox
        api={employeeSearchApi}
        collapseOnSelect
        onSelect={handleSelect}
      />

      <Card
        title="선택 결과"
        style={{ borderColor: "#dbe3ef", borderRadius: 8 }}
      >
        {selectedEmployee ? (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="사원번호">
              {selectedEmployee.employeeNo}
            </Descriptions.Item>
            <Descriptions.Item label="사원명">
              {selectedEmployee.name}
            </Descriptions.Item>
            <Descriptions.Item label="부서">
              {selectedEmployee.departmentName}
            </Descriptions.Item>
            <Descriptions.Item label="직위">
              {selectedEmployee.positionName}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="선택된 사원이 없습니다."
          />
        )}
      </Card>
    </Space>
  );
}
