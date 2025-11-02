export const formatMoneyEUR = (n: number, locale?: string) =>
  new Intl.NumberFormat(locale ?? undefined, { style: 'currency', currency: 'EUR' }).format(n)

export const formatDateTime = (iso: string, locale?: string) =>
  new Intl.DateTimeFormat(locale ?? undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
