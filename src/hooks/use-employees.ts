import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/lib/fake-api'
import type { Employee } from '@/lib/types'

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
}

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: fetchEmployees,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployee(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Employee>) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      updateEmployee(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      queryClient.setQueryData(employeeKeys.detail(updated.id), updated)
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      queryClient.removeQueries({ queryKey: employeeKeys.detail(id) })
    },
  })
}
