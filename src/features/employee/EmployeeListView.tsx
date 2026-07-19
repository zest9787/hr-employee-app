import type { ColDef, GridApi } from "@ag-grid-community/core";
import {
  AgGridWrapper,
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
import styled from "styled-components";
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

const searchFormClassName = "employee-list-search-form";

const SearchFormShell = styled.div`
  .${searchFormClassName} {
    display: grid !important;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 12px;
    align-items: end;
  }

  .${searchFormClassName} .ant-form-item-control,
  .${searchFormClassName} .ant-form-item-control-input,
  .${searchFormClassName} .ant-form-item-control-input-content {
    min-width: 0;
  }

  .${searchFormClassName} .employee-search-field,
  .${searchFormClassName} .employee-search-box-no-tree {
    width: 100%;
    display: flex;
  }

  .${searchFormClassName} .employee-search-code {
    flex: 0 0 88px;
    width: auto !important;
  }

  .${searchFormClassName} .employee-search-name {
    flex: 1 1 auto;
    width: auto !important;
    min-width: 0;
  }
`;

const SearchItem = styled(Form.Item).withConfig({
  shouldForwardProp: (prop) => !["span", "mediumSpan"].includes(prop),
})<{ span: number; mediumSpan?: number }>`
  grid-column: span ${({ span }) => span};
  margin: 0;
  min-width: 0;

  @media (max-width: 1200px) {
    grid-column: span ${({ mediumSpan, span }) => mediumSpan ?? span};
  }

  @media (max-width: 720px) {
    grid-column: 1 / -1;
  }
`;

const SearchActions = styled(SearchButtonGroup).withConfig({
  shouldForwardProp: (prop) => prop !== "span",
})<{ span: number }>`
  grid-column: ${({ span }) => `${13 - span} / 13`};
  grid-row: 1 / span 2;
  justify-self: end;
  align-self: stretch;
  padding-left: 16px;
  border-left: 1px solid #dbe3ef;
  display: flex;
  align-items: center;
  margin: 0;
  min-width: 0;

  .ant-form-item-control,
  .ant-form-item-control-input,
  .ant-form-item-control-input-content {
    height: 100%;
  }

  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  @media (max-width: 1200px) {
    grid-column: 1 / -1;
    grid-row: auto;
    justify-self: stretch;
    min-height: 44px;
    padding-top: 12px;
    padding-left: 0;
    border-top: 1px solid #dbe3ef;
    border-left: 0;
  }
`;

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
      <SearchFormShell>
        <SearchFormLayout
          formClassName={searchFormClassName}
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
          <SearchItem span={3} mediumSpan={6} name="employee" label={"사원"}>
            <EmployeeSearchField api={employeeSearchApi} />
          </SearchItem>
          <SearchItem span={2} mediumSpan={3} name="organizationId" label={"조직"}>
            <Select style={{ width: "100%" }} options={[{ value: "HR", label: "인사팀" }]} />
          </SearchItem>
          <SearchItem span={2} mediumSpan={3} name="employmentStatus" label={"재직 상태"}>
            <Select
              style={{ width: "100%" }}
              options={[
                { value: "ACTIVE", label: "재직" },
                { value: "LEAVE", label: "휴직" },
              ]}
            />
          </SearchItem>
          <SearchItem span={3} mediumSpan={6} name="hireDateRange" label={"입사일 범위"}>
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </SearchItem>
          <SearchActions span={2} onReset={reset} />
        </SearchFormLayout>
      </SearchFormShell>
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
