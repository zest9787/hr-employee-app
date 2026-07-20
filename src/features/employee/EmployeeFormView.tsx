import { PageHeader } from "@company/hr-common-ui";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import { useEffect } from "react";
import type { Employee, EmployeePayload } from "../../entities/employee/types";
import {
  useCreateEmployee,
  useEmployeeDetail,
  useUpdateEmployee,
} from "./queries";

interface EmployeeFormViewProps {
  mode: "create" | "edit";
  employeeId?: string;
  onBack: () => void;
}

type EmployeeFormValues = EmployeePayload;

const organizationOptions = [
  { value: "인사팀", label: "인사팀" },
  { value: "재무팀", label: "재무팀" },
  { value: "플랫폼팀", label: "플랫폼팀" },
  { value: "조직문화팀", label: "조직문화팀" },
  { value: "법무팀", label: "법무팀" },
];

const employmentStatusOptions = [
  { value: "ACTIVE", label: "재직" },
  { value: "LEAVE", label: "휴직" },
  { value: "RETIRED", label: "퇴직" },
];

export function EmployeeFormView({
  mode,
  employeeId,
  onBack,
}: EmployeeFormViewProps) {
  const [form] = Form.useForm<EmployeeFormValues>();
  const isEdit = mode === "edit";
  const {
    data: employee,
    error,
    isError,
    isFetching,
    refetch,
  } = useEmployeeDetail(employeeId);
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const isSaving = createEmployee.isPending || updateEmployee.isPending;

  useEffect(() => {
    if (isEdit) {
      if (!employee) return;
      form.setFieldsValue(toFormValues(employee));
      return;
    }

    form.setFieldsValue({
      employeeNo: "",
      name: "",
      organizationName: undefined,
      employmentStatus: "ACTIVE",
      hireDate: "",
    });
  }, [employee, form, isEdit]);

  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      if (isEdit && employeeId) {
        await updateEmployee.mutateAsync({ employeeId, payload: values });
        message.success("사원 정보가 수정되었습니다.");
      } else {
        await createEmployee.mutateAsync(values);
        message.success("사원이 등록되었습니다.");
      }

      onBack();
    } catch (submitError) {
      message.error(
        getEmployeeErrorMessage(
          submitError,
          "사원 정보를 저장하지 못했습니다.",
        ),
      );
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <PageHeader
        title={isEdit ? "사원 수정" : "사원 등록"}
        description={
          isEdit
            ? "선택한 사원의 기본 정보를 수정합니다."
            : "신규 사원의 기본 정보를 입력합니다."
        }
        actions={
          <Space>
            <Button onClick={onBack}>목록</Button>
            <Button
              type="primary"
              loading={isSaving}
              onClick={() => form.submit()}
            >
              {isEdit ? "수정" : "등록"}
            </Button>
          </Space>
        }
      />
      <Card
        style={{ borderColor: "#dbe3ef", borderRadius: 8 }}
        styles={{ body: { padding: 20 } }}
      >
        {isError && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            message={getEmployeeErrorMessage(
              error,
              "사원 정보를 조회하지 못했습니다.",
            )}
            action={<Button onClick={() => void refetch()}>재시도</Button>}
          />
        )}
        <Spin spinning={isFetching}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="employeeNo"
              label="사번"
              rules={[
                { required: true, message: "사번을 입력해주세요." },
                { max: 8, message: "사번은 8자리 이하로 입력해주세요." },
              ]}
            >
              <Input maxLength={8} placeholder="예: 2024001" />
            </Form.Item>
            <Form.Item
              name="name"
              label="사원명"
              rules={[{ required: true, message: "사원명을 입력해주세요." }]}
            >
              <Input placeholder="예: 김민수" />
            </Form.Item>
            <Form.Item
              name="organizationName"
              label="조직"
              rules={[{ required: true, message: "조직을 선택해주세요." }]}
            >
              <Select options={organizationOptions} placeholder="조직 선택" />
            </Form.Item>
            <Form.Item
              name="employmentStatus"
              label="재직 상태"
              rules={[{ required: true, message: "재직 상태를 선택해주세요." }]}
            >
              <Select options={employmentStatusOptions} />
            </Form.Item>
            <Form.Item
              name="hireDate"
              label="입사일"
              rules={[
                { required: true, message: "입사일을 입력해주세요." },
                {
                  pattern: /^\d{4}-\d{2}-\d{2}$/,
                  message: "YYYY-MM-DD 형식으로 입력해주세요.",
                },
              ]}
            >
              <Input placeholder="예: 2024-01-15" />
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </Space>
  );
}

function toFormValues(employee: Employee): EmployeeFormValues {
  return {
    employeeNo: employee.employeeNo,
    name: employee.name,
    organizationName: employee.organizationName,
    employmentStatus: employee.employmentStatus,
    hireDate: employee.hireDate,
  };
}

function getEmployeeErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}
