import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPulses,
  fetchPulse,
  createPulse,
  activatePulse,
  fetchMyPulse,
  submitPulseResponse,
} from '@/lib/fake-api'
import type { Pulse, PulseAnswer } from '@/lib/types'

export const pulseKeys = {
  all: ['pulses'] as const,
  lists: () => [...pulseKeys.all, 'list'] as const,
  detail: (id: string) => [...pulseKeys.all, 'detail', id] as const,
  mine: () => [...pulseKeys.all, 'mine'] as const,
}

export function usePulses() {
  return useQuery({
    queryKey: pulseKeys.lists(),
    queryFn: fetchPulses,
    staleTime: 1000 * 60 * 3,
  })
}

export function usePulse(id: string) {
  return useQuery({
    queryKey: pulseKeys.detail(id),
    queryFn: () => fetchPulse(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  })
}

export function useMyPulse() {
  return useQuery({
    queryKey: pulseKeys.mine(),
    queryFn: fetchMyPulse,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreatePulse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Pulse>) => createPulse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pulseKeys.lists() })
    },
  })
}

export function useActivatePulse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activatePulse(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: pulseKeys.lists() })
      queryClient.setQueryData(pulseKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: pulseKeys.mine() })
    },
  })
}

export function useSubmitPulseResponse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pulseId, answers }: { pulseId: string; answers: PulseAnswer[] }) =>
      submitPulseResponse(pulseId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pulseKeys.mine() })
      queryClient.invalidateQueries({ queryKey: pulseKeys.lists() })
    },
  })
}
