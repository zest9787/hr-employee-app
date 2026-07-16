import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "./api";
import type { EmployeeSearchParams } from "../../entities/employee/types";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: EmployeeSearchParams, page: { page: number; size: number }) => [...employeeKeys.lists(), params, page] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (employeeId: string) => [...employeeKeys.details(), employeeId] as const,
};

export function useEmployees(params: EmployeeSearchParams | null, page: { page: number; size: number }) {
  return useQuery({
    queryKey: params ? employeeKeys.list(params, page) : employeeKeys.lists(),
    queryFn: () => employeeApi.search(params!, page),
    enabled: Boolean(params),
    staleTime: 30_000,
  });
}
