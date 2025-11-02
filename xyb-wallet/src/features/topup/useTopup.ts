import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../core/lib/api'
import type { Payment } from '../../core/lib/api'

export const useTopup = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (amount: number) => api.topup(amount),
    onMutate: async (amount) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: ['balance'] }),
        qc.cancelQueries({ queryKey: ['payments'] }),
        qc.cancelQueries({ queryKey: ['todaysTopups'] }),
      ])
      const prevBalance = qc.getQueryData<{ accountNumber: string; balance: number; currency: string }>(['balance'])
      const key = ['payments', { limit: 10, offset: 0 }] as const
      const prevPage = qc.getQueryData<{ transactions: Payment[]; total: number; limit: number; offset: number }>(key)

      if (prevBalance) qc.setQueryData(['balance'], { ...prevBalance, balance: prevBalance.balance + amount })
      if (prevPage) {
        qc.setQueryData(key, {
          ...prevPage,
          transactions: [
            { 
              id: `optimistic-${Date.now()}`, 
              accountNumber: prevBalance?.accountNumber || 'ACC123',
              type: 'topup', 
              amount, 
              currency: prevBalance?.currency || 'USD',
              timestamp: new Date().toISOString(), 
              description: 'Top-up'
            },
            ...prevPage.transactions,
          ],
          total: prevPage.total + 1,
        })
      }
      return { prevBalance, key, prevPage }
    },
    onError: (_err, _amount, ctx) => {
      if (!ctx) return
      if (ctx.prevBalance) qc.setQueryData(['balance'], ctx.prevBalance)
      if (ctx.prevPage) qc.setQueryData(ctx.key, ctx.prevPage)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['balance'] })
      qc.invalidateQueries({ queryKey: ['payments'] })
      qc.invalidateQueries({ queryKey: ['todaysTopups'] })
    },
  })
}
