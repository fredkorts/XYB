export type Balance = { accountNumber: string; balance: number; currency: string }
export type Payment = {
  id: string
  accountNumber: string
  type: 'topup' | 'payment'
  amount: number
  currency: string
  timestamp: string
  description?: string
}
export type PaymentsPage = { transactions: Payment[]; total: number; limit: number; offset: number }

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { headers: { 'Content-Type': 'application/json' }, ...init })
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
  return res.json() as Promise<T>
}

export const api = {
  getBalance: () => http<Balance>(`${BASE}/account`),
  getPayments: (limit: number, offset: number) =>
    http<PaymentsPage>(`${BASE}/account/transactions?limit=${limit}&offset=${offset}`),
  topup: (amount: number) =>
    http<{ transaction: Payment; newBalance: number }>(`${BASE}/account/topup`, { method: 'POST', body: JSON.stringify({ amount }) }),
}
