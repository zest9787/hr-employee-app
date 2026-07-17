import type { ColDef, GridApi } from "@ag-grid-community/core";
import {
  AgGridWrapper,
  EmployeeSearchBoxNoTree,
  EmployeeSearchField,
  PageHeader,
  PermissionButton,
  SearchButtonGroup,
  SearchFormLayout,
} from "@company/hr-common-ui";
import type { EmployeeSearchValue } from "@company/hr-common-ui";
import { Button, Card, DatePicker, Form, Select, Space } from "antd";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Employee, EmployeeSearchParams } from "../../entities/employee/types";
import { employeeSearchApi } from "./employeeSearchApi";
import { useEmployees } from "./queries";

interface EmployeeListViewProps {
  state: EmployeeListState;
  onStateChange: Dispatch<SetStateAction<EmployeeListState>>;
  onSelectEmployee: (employeeId: string) => void;
}

type EmployeeSearchFormValues = Omit<EmployeeSearchParams, "hireDateRange"> & {
  hireDateRange?: object;
  employee?: EmployeeSearchValue;
};

export interface EmployeeListState {
  formValues: EmployeeSearchFormValues;
  searchParams: EmployeeSearchParams | null;
  page: { page: number; size: number };
}

export function EmployeeListView({ state, onStateChange, onSelectEmployee }: EmployeeListViewProps) {
  const [form] = Form.useForm<EmployeeSearchFormValues>();
  const gridApiRef = useRef<GridApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { data, isFetching } = useEmployees(state.searchParams, state.page);

  useEffect(() => {
    form.setFieldsValue(state.formValues);
  }, [form, state.formValues]);

  const columns = useMemo<ColDef<Employee>[]>(
    () => [
      {
        field: "employeeNo",
        headerName: "사번",
        sortable: true,
        cellClass: "employee-no-cell",
        cellRenderer: ({ data, value }: { data?: Employee; value?: string }) => (
          <Button
            type="link"
            size="small"
            style={{ display: "inline-flex", alignItems: "center", height: 24, padding: 0, lineHeight: 1 }}
            onClick={() => {
              if (data?.id) onSelectEmployee(data.id);
            }}
          >
            {value}
          </Button>
        ),
      },
      { field: "name", headerName: "사원명", sortable: true },
      { field: "organizationName", headerName: "조직" },
      { field: "employmentStatus", headerName: "재직 상태" },
      { field: "hireDate", headerName: "입사일" },
    ],
    [onSelectEmployee],
  );

  const reset = () => {
    form.resetFields();
    onStateChange({
      formValues: {},
      searchParams: import.meta.env.VITE_ENABLE_MOCK === "true" ? {} : null,
      page: { page: 0, size: 20 },
    });
    setSelectedRows([]);
    gridApiRef.current?.deselectAll();
  };

  return (
    <>
      <PageHeader
        title={"사원관리"}
        description={"사원 정보를 검색하고 조직별 인원을 관리합니다."}
        actions={<PermissionButton permission="EMPLOYEE_CREATE">{"사원 등록"}</PermissionButton>}
      />
      <SearchFormLayout
        form={form}
        onFinish={(values) => {
          const { employee, ...restValues } = values;
          onStateChange({
            formValues: values,
            searchParams: {
              ...restValues,
              employeeNo: employee?.employeeNo,
            },
            page: { page: 0, size: 20 },
          });
        }}
      >
        <Form.Item name="employee" label={"사원"}>
          <EmployeeSearchField api={employeeSearchApi} />
        </Form.Item>
        <Form.Item name="employee" label={"사원"}>
          <EmployeeSearchBoxNoTree api={employeeSearchApi} />
        </Form.Item>
        <Form.Item name="organizationId" label={"조직"}>
          <Select style={{ width: 150 }} options={[{ value: "HR", label: "인사팀" }]} />
        </Form.Item>
        <Form.Item name="employmentStatus" label={"재직 상태"}>
          <Select
            style={{ width: 150 }}
            options={[
              { value: "ACTIVE", label: "재직" },
              { value: "LEAVE", label: "휴직" },
            ]}
          />
        </Form.Item>
        <Form.Item name="hireDateRange" label={"입사일 범위"}>
          <DatePicker.RangePicker />
        </Form.Item>
        <SearchButtonGroup onReset={reset} />
      </SearchFormLayout>
      <Card
        size="small"
        style={{ borderColor: "#dbe3ef", borderRadius: 8 }}
        styles={{ body: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 } }}
      >
        <span style={{ color: "#667085", fontSize: 13 }}>
          {"선택"} {selectedRows.length}{"건"}
        </span>
        <Space>
          <Button>{"엑셀 다운로드"}</Button>
          <PermissionButton permission="EMPLOYEE_DELETE" disabled={!selectedRows.length}>
            {"삭제"}
          </PermissionButton>
        </Space>
      </Card>
      <AgGridWrapper
        gridApiRef={gridApiRef}
        columnDefs={columns}
        rowData={data?.content ?? []}
        loading={isFetching}
        rowSelection="multiple"
        pagination
        paginationPageSize={state.page.size}
        onSelectionChanged={(event) => setSelectedRows(event.api.getSelectedRows().map((row) => row.id))}
      />
    </>
  );
}
