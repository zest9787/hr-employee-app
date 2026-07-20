import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "./api";
import type {
  EmployeePayload,
  EmployeeSearchParams,
} from "../../entities/employee/types";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: EmployeeSearchParams, page: { page: number; size: number }) =>
    [...employeeKeys.lists(), params, page] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (employeeId: string) =>
    [...employeeKeys.details(), employeeId] as const,
};

export function useEmployees(
  params: EmployeeSearchParams | null,
  page: { page: number; size: number },
) {
  return useQuery({
    queryKey: params ? employeeKeys.list(params, page) : employeeKeys.lists(),
    queryFn: () => employeeApi.search(params!, page),
    enabled: Boolean(params),
    staleTime: 30_000,
  });
}

export function useEmployeeDetail(employeeId?: string) {
  return useQuery({
    queryKey: employeeId
      ? employeeKeys.detail(employeeId)
      : employeeKeys.details(),
    queryFn: () => employeeApi.detail(employeeId!),
    enabled: Boolean(employeeId),
    staleTime: 30_000,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeePayload) => employeeApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: string;
      payload: EmployeePayload;
    }) => employeeApi.update(employeeId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(variables.employeeId),
      });
    },
  });
}

export function useDeleteEmployees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeIds: string[]) =>
      Promise.all(
        employeeIds.map((employeeId) => employeeApi.remove(employeeId)),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: employeeKeys.details() });
    },
  });
}
