import { PageHeader } from "@company/hr-common-ui";
import { Alert, Button, Card, Descriptions, Space, Spin } from "antd";
import type { Employee } from "../../entities/employee/types";
import { useEmployeeDetail } from "./queries";

interface EmployeeDetailViewProps {
  employeeId: string;
  onBack: () => void;
}

const employmentStatusLabels: Record<Employee["employmentStatus"], string> = {
  ACTIVE: "재직",
  LEAVE: "휴직",
  RETIRED: "퇴직",
};

export function EmployeeDetailView({ employeeId, onBack }: EmployeeDetailViewProps) {
  const { data: detail, error, isError, isFetching, refetch } = useEmployeeDetail(employeeId);

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <PageHeader
        title="사원 상세"
        description="선택한 사원의 상세 정보를 조회합니다."
        actions={<Button onClick={onBack}>목록</Button>}
      />
      <Card style={{ borderColor: "#dbe3ef", borderRadius: 8 }} styles={{ body: { padding: 20 } }}>
        {isError && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            message={getErrorMessage(error)}
            action={<Button onClick={() => void refetch()}>재시도</Button>}
          />
        )}
        <Spin spinning={isFetching}>
          <Descriptions bordered column={2} size="middle">
            <Descriptions.Item label="사번">{detail?.employeeNo ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="사원명">{detail?.name ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="조직">{detail?.organizationName ?? "-"}</Descriptions.Item>
            <Descriptions.Item label="재직 상태">
              {detail ? employmentStatusLabels[detail.employmentStatus] : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="입사일" span={2}>
              {detail?.hireDate ?? "-"}
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </Card>
    </Space>
  );
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "사원 상세 정보를 조회하지 못했습니다.";
}
