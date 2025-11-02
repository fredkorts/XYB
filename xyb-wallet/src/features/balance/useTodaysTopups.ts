import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'

const isToday = (timestamp: string): boolean => {
  const today = new Date()
  const date = new Date(timestamp)
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const useTodaysTopups = () => {
  return useQuery({
    queryKey: ['todaysTopups'],
    queryFn: async () => {
      // Fetch enough transactions to cover today's potential topups
      // We'll fetch more than needed to ensure we get all of today's transactions
      const data = await api.getPayments(50, 0)
      
      // Filter for today's top-ups only
      const todaysTopups = data.transactions.filter(
        transaction => transaction.type === 'topup' && isToday(transaction.timestamp)
      )
      
      // Calculate the sum
      const totalTopupsToday = todaysTopups.reduce((sum, topup) => sum + topup.amount, 0)
      
      return {
        topups: todaysTopups,
        totalAmount: totalTopupsToday,
        count: todaysTopups.length
      }
    },
    staleTime: 60_000, // Consider data fresh for 1 minute
  })
}