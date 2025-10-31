import { Table, Alert } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { usePayments } from './usePayments'
import type { Payment } from '../../lib/api'
import { useTranslation } from 'react-i18next'
import { formatDateTime, formatMoneyEUR } from '../../lib/format'

export function PaymentsTable() {
  const { t, i18n } = useTranslation('payments')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const offset = (page - 1) * pageSize
  const { data, isLoading, isError, error } = usePayments(pageSize, offset)

  const columns: ColumnsType<Payment> = [
    { title: t('date'), dataIndex: 'timestamp', key: 'date', render: (v: string) => formatDateTime(v, i18n.language) },
    { title: t('type'), dataIndex: 'type', key: 'type', render: (v: Payment['type']) => t(`type.${v}`) },
    { title: t('amount'), dataIndex: 'amount', key: 'amount', render: (n: number) => formatMoneyEUR(n, i18n.language) },
    { title: t('description'), dataIndex: 'description', key: 'description', render: (desc?: string) => desc || '-' },
  ]

  if (isError) return <Alert type="error" showIcon role="alert" message={t('loadError')} description={(error as Error)?.message} />

  return (
    <Table
      rowKey={(r) => r.id}
      loading={isLoading}
      columns={columns}
      dataSource={data?.transactions ?? []}
      pagination={{
        current: page,
        total: data?.total ?? 0,
        pageSize,
        onChange: (p) => setPage(p),
        showSizeChanger: false,
      }}
      locale={{ emptyText: t('empty') }}
    />
  )
}
