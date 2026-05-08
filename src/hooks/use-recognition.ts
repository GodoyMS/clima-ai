import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRecognitions, createRecognition } from '@/lib/fake-api'
import type { Recognition } from '@/lib/types'

export const recognitionKeys = {
  all: ['recognitions'] as const,
  lists: () => [...recognitionKeys.all, 'list'] as const,
}

export function useRecognitions() {
  return useQuery({
    queryKey: recognitionKeys.lists(),
    queryFn: fetchRecognitions,
    staleTime: 1000 * 60 * 3,
  })
}

export function useCreateRecognition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Recognition>) => createRecognition(data),
    onSuccess: (newRecognition) => {
      queryClient.setQueryData(
        recognitionKeys.lists(),
        (old: Recognition[] | undefined) => {
          if (!old) return [newRecognition]
          return [newRecognition, ...old]
        },
      )
    },
  })
}
