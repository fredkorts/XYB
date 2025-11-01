import { http, HttpResponse, delay } from 'msw'

let BALANCE = 100
let PAYMENTS: Array<{ id: string; type: 'topup'|'debit'; amount: number; createdAt: string; status: 'completed'|'pending'|'failed' }> = []

export const handlers = [
  http.get('http://localhost:3000/account', async () => {
    await delay(50)
    return HttpResponse.json({ accountNumber: 'ACC123', balance: BALANCE, currency: 'USD' })
  }),

  http.get('http://localhost:3000/account/transactions', async ({ request }) => {
    await delay(50)
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const transactions = PAYMENTS.slice(offset, offset + limit).map(p => ({
      ...p,
      accountNumber: 'ACC123',
      type: p.type === 'topup' ? 'topup' as const : 'payment' as const,
      currency: 'USD',
      timestamp: p.createdAt,
      description: `${p.type} transaction`
    }))
    return HttpResponse.json({ transactions, total: PAYMENTS.length, limit, offset })
  }),

  http.post('http://localhost:3000/account/topup', async ({ request }) => {
    await delay(200) // simulate latency
    const { amount } = (await request.json()) as { amount: number }
    if (amount <= 0) {
      return new HttpResponse('Invalid amount', { status: 400 })
    }
    BALANCE += amount
    const payment = {
      id: String(Date.now()),
      type: 'topup' as const,
      amount,
      createdAt: new Date().toISOString(),
      status: 'completed' as const,
    }
    PAYMENTS.unshift(payment)
    const transaction = {
      ...payment,
      accountNumber: 'ACC123',
      currency: 'USD',
      timestamp: payment.createdAt,
      description: 'topup transaction'
    }
    return HttpResponse.json({ transaction, newBalance: BALANCE })
  }),
]

// helpers for tests to reseed state
export function seed({ balance = 100, payments = [] as typeof PAYMENTS } = {}) {
  BALANCE = balance
  PAYMENTS = payments
}
