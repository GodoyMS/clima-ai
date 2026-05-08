import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchInsights, fetchInsight, markInsightRead } from '@/lib/fake-api'

export const insightKeys = {
  all: ['insights'] as const,
  lists: () => [...insightKeys.all, 'list'] as const,
  detail: (id: string) => [...insightKeys.all, 'detail', id] as const,
}

export function useInsights() {
  return useQuery({
    queryKey: insightKeys.lists(),
    queryFn: fetchInsights,
    staleTime: 1000 * 60 * 5,
  })
}

export function useInsight(id: string) {
  return useQuery({
    queryKey: insightKeys.detail(id),
    queryFn: () => fetchInsight(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useMarkInsightRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markInsightRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: insightKeys.lists() })
      const previous = queryClient.getQueryData(insightKeys.lists())
      queryClient.setQueryData(insightKeys.lists(), (old: ReturnType<typeof fetchInsights> extends Promise<infer T> ? T : never) => {
        if (!old) return old
        return (old as Awaited<ReturnType<typeof fetchInsights>>).map((insight) =>
          insight.id === id ? { ...insight, isRead: true } : insight,
        )
      })
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(insightKeys.lists(), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: insightKeys.lists() })
    },
  })
}
