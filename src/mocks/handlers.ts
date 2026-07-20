import { http, HttpResponse } from "msw";
import type { Employee, EmployeePayload } from "../entities/employee/types";

let employees: Employee[] = [
  {
    id: "E-1001",
    employeeNo: "2024001",
    name: "김민수",
    organizationName: "인사팀",
    employmentStatus: "ACTIVE",
    hireDate: "2024-01-15",
  },
  {
    id: "E-1002",
    employeeNo: "2023007",
    name: "이서연",
    organizationName: "재무팀",
    employmentStatus: "ACTIVE",
    hireDate: "2023-04-03",
  },
  {
    id: "E-1003",
    employeeNo: "2022018",
    name: "박준호",
    organizationName: "플랫폼팀",
    employmentStatus: "LEAVE",
    hireDate: "2022-09-19",
  },
  {
    id: "E-1004",
    employeeNo: "2021032",
    name: "최유진",
    organizationName: "조직문화팀",
    employmentStatus: "ACTIVE",
    hireDate: "2021-11-08",
  },
  {
    id: "E-1005",
    employeeNo: "2020044",
    name: "정현우",
    organizationName: "법무팀",
    employmentStatus: "RETIRED",
    hireDate: "2020-02-24",
  },
];

const companies = [
  { id: "C-100", name: "대한 HR" },
  { id: "C-200", name: "글로벌 HR" },
];

type MockDepartment = {
  key: string;
  title: string;
  children?: MockDepartment[];
};

const departmentsByCompany: Record<string, MockDepartment[]> = {
  "C-100": [
    {
      key: "C100-ORG-HR",
      title: "인사부문",
      children: [
        { key: "C100-ORG-HR-01", title: "인사팀" },
        { key: "C100-ORG-HR-02", title: "조직문화팀" },
      ],
    },
    {
      key: "C100-ORG-BIZ",
      title: "경영지원",
      children: [
        { key: "C100-ORG-FIN", title: "재무팀" },
        { key: "C100-ORG-LEGAL", title: "법무팀" },
      ],
    },
    { key: "C100-ORG-PLATFORM", title: "플랫폼팀" },
  ],
  "C-200": [
    {
      key: "C200-ORG-GLOBAL",
      title: "글로벌 운영",
      children: [
        { key: "C200-ORG-TALENT", title: "글로벌 인재팀" },
        { key: "C200-ORG-REWARD", title: "보상기획팀" },
      ],
    },
    {
      key: "C200-ORG-GROWTH",
      title: "성장전략",
      children: [
        { key: "C200-ORG-DATA", title: "피플데이터팀" },
        { key: "C200-ORG-EXP", title: "구성원경험팀" },
      ],
    },
  ],
};

const globalEmployeeSearchRows = [
  {
    id: "G-2001",
    employeeNo: "3024001",
    name: "한지아",
    companyId: "C-200",
    companyName: "글로벌 HR",
    departmentName: "글로벌 인재팀",
    positionName: "리드",
  },
  {
    id: "G-2002",
    employeeNo: "3023012",
    name: "오세훈",
    companyId: "C-200",
    companyName: "글로벌 HR",
    departmentName: "보상기획팀",
    positionName: "매니저",
  },
  {
    id: "G-2003",
    employeeNo: "3022034",
    name: "윤서진",
    companyId: "C-200",
    companyName: "글로벌 HR",
    departmentName: "피플데이터팀",
    positionName: "시니어",
  },
  {
    id: "G-2004",
    employeeNo: "3021041",
    name: "장도윤",
    companyId: "C-200",
    companyName: "글로벌 HR",
    departmentName: "구성원경험팀",
    positionName: "매니저",
  },
];

function getEmployeeSearchRows() {
  return employees
    .map((employee) => ({
      id: employee.id,
      employeeNo: employee.employeeNo,
      name: employee.name,
      companyId: companies[0].id,
      companyName: companies[0].name,
      departmentName: employee.organizationName,
      positionName:
        employee.employmentStatus === "ACTIVE" ? "매니저" : "시니어",
    }))
    .concat(globalEmployeeSearchRows);
}

const ok = <T>(data: T) =>
  HttpResponse.json({ success: true, data, traceId: "mock-trace-employee" });

export const handlers = [
  http.get(/\/(?:employee\/)?api\/auth\/me$/, () =>
    ok({
      id: "U-10001",
      name: "홍길동",
      roles: ["HR_ADMIN"],
      permissions: [
        "EMPLOYEE_READ",
        "EMPLOYEE_CREATE",
        "EMPLOYEE_UPDATE",
        "EMPLOYEE_DELETE",
      ],
    }),
  ),
  http.post(/\/(?:employee\/)?api\/auth\/logout$/, () => ok({ success: true })),
  http.get(/\/(?:employee\/)?api\/employee-search\/companies$/, () =>
    ok(companies),
  ),
  http.get(
    /\/(?:employee\/)?api\/employee-search\/companies\/(?<companyId>[^/]+)\/departments$/,
    ({ params }: { params: Record<string, string> }) =>
      ok(departmentsByCompany[params.companyId] ?? []),
  ),
  http.get(
    /\/(?:employee\/)?api\/employee-search\/employees$/,
    ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      const companyId = (url.searchParams.get("companyId") ?? "").trim();
      const keyword = (url.searchParams.get("keyword") ?? "").trim();
      const rows = getEmployeeSearchRows().filter((row) => {
        const matchesCompany = !companyId || row.companyId === companyId;
        const matchesKeyword =
          !keyword ||
          row.employeeNo.includes(keyword) ||
          row.name.includes(keyword);
        return matchesCompany && matchesKeyword;
      });
      return ok(rows);
    },
  ),
  http.get(
    /\/(?:employee\/)?api\/employee-search\/departments\/(?<departmentId>[^/]+)\/employees$/,
    ({
      params,
      request,
    }: {
      params: Record<string, string>;
      request: Request;
    }) => {
      const url = new URL(request.url);
      const companyId = (url.searchParams.get("companyId") ?? "").trim();
      const departmentNameById: Record<string, string> = {
        "C100-ORG-HR": "인사팀",
        "C100-ORG-HR-01": "인사팀",
        "C100-ORG-HR-02": "조직문화팀",
        "C100-ORG-FIN": "재무팀",
        "C100-ORG-LEGAL": "법무팀",
        "C100-ORG-PLATFORM": "플랫폼팀",
        "C200-ORG-GLOBAL": "글로벌 인재팀",
        "C200-ORG-TALENT": "글로벌 인재팀",
        "C200-ORG-REWARD": "보상기획팀",
        "C200-ORG-GROWTH": "피플데이터팀",
        "C200-ORG-DATA": "피플데이터팀",
        "C200-ORG-EXP": "구성원경험팀",
      };
      const departmentName = departmentNameById[params.departmentId];
      return ok(
        getEmployeeSearchRows().filter((row) => {
          const matchesCompany = !companyId || row.companyId === companyId;
          const matchesDepartment =
            !departmentName || row.departmentName === departmentName;
          return matchesCompany && matchesDepartment;
        }),
      );
    },
  ),
  http.get(
    /\/(?:employee\/)?api\/employees$/,
    ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") ?? "0");
      const size = Number(url.searchParams.get("size") ?? "20");
      const employeeNo = (url.searchParams.get("employeeNo") ?? "").trim();
      const name = (url.searchParams.get("name") ?? "").trim();
      const organizationId = (
        url.searchParams.get("organizationId") ?? ""
      ).trim();
      const employmentStatus = (
        url.searchParams.get("employmentStatus") ?? ""
      ).trim();
      const organizationNameById: Record<string, string> = {
        HR: "인사팀",
        FIN: "재무팀",
        PLATFORM: "플랫폼팀",
        CULTURE: "조직문화팀",
        LEGAL: "법무팀",
      };
      const filteredEmployees = employees.filter((employee) => {
        const matchesEmployeeNo =
          !employeeNo || employee.employeeNo.includes(employeeNo);
        const matchesName = !name || employee.name.includes(name);
        const matchesOrganization =
          !organizationId ||
          employee.organizationName ===
            (organizationNameById[organizationId] ?? organizationId);
        const matchesStatus =
          !employmentStatus || employee.employmentStatus === employmentStatus;

        return (
          matchesEmployeeNo &&
          matchesName &&
          matchesOrganization &&
          matchesStatus
        );
      });

      return ok({
        content: filteredEmployees.slice(page * size, page * size + size),
        page,
        size,
        totalElements: filteredEmployees.length,
        totalPages: Math.ceil(filteredEmployees.length / size),
      });
    },
  ),
  http.get(
    /\/(?:employee\/)?api\/employees\/(?<employeeId>[^/]+)$/,
    ({ params }: { params: Record<string, string> }) =>
      ok(
        employees.find((item) => item.id === params.employeeId) ?? employees[0],
      ),
  ),
  http.post(
    /\/(?:employee\/)?api\/employees$/,
    async ({ request }: { request: Request }) => {
      const body = (await request.json()) as EmployeePayload;
      const employee = { id: `E-${Date.now()}`, ...body };
      employees = [employee, ...employees];
      return ok(employee);
    },
  ),
  http.put(
    /\/(?:employee\/)?api\/employees\/(?<employeeId>[^/]+)$/,
    async ({
      params,
      request,
    }: {
      params: Record<string, string>;
      request: Request;
    }) => {
      const body = (await request.json()) as EmployeePayload;
      const employee = { id: params.employeeId, ...body };
      employees = employees.map((item) =>
        item.id === params.employeeId ? employee : item,
      );
      return ok(employee);
    },
  ),
  http.delete(
    /\/(?:employee\/)?api\/employees\/(?<employeeId>[^/]+)$/,
    ({ params }: { params: Record<string, string> }) => {
      employees = employees.filter((item) => item.id !== params.employeeId);
      return ok(null);
    },
  ),
];
