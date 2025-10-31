import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
export const useBalance = () =>
  useQuery({ queryKey: ['balance'], queryFn: api.getBalance, staleTime: 15_000 })
