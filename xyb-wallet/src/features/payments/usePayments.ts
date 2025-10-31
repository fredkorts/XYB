import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '../../lib/api'
export const usePayments = (limit: number, offset: number) =>
  useQuery({ queryKey: ['payments', { limit, offset }], queryFn: () => api.getPayments(limit, offset), placeholderData: keepPreviousData })
