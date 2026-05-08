import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardKpis,
  fetchEngagementData,
  fetchDepartmentEngagement,
} from '@/lib/fake-api'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: () => [...dashboardKeys.all, 'kpis'] as const,
  engagement: () => [...dashboardKeys.all, 'engagement'] as const,
  departments: () => [...dashboardKeys.all, 'departments'] as const,
}

export function useDashboardKpis() {
  return useQuery({
    queryKey: dashboardKeys.kpis(),
    queryFn: fetchDashboardKpis,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEngagementData() {
  return useQuery({
    queryKey: dashboardKeys.engagement(),
    queryFn: fetchEngagementData,
    staleTime: 1000 * 60 * 10,
  })
}

export function useDepartmentEngagement() {
  return useQuery({
    queryKey: dashboardKeys.departments(),
    queryFn: fetchDepartmentEngagement,
    staleTime: 1000 * 60 * 5,
  })
}
