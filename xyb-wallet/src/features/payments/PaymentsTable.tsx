import { Card, Alert, Pagination, Empty, Skeleton } from 'antd'
import { useState } from 'react'
import { usePayments } from './usePayments'
import { useTranslation } from 'react-i18next'
import { formatDateTime, formatMoneyEUR } from '../../lib/format'
import './PaymentsTable.css'

export function PaymentsTable() {
  const { t, i18n } = useTranslation('payments')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const offset = (page - 1) * pageSize
  const { data, isLoading, isError, error } = usePayments(pageSize, offset)

  if (isError) return <Alert type="error" showIcon role="alert" message={t('loadError')} description={(error as Error)?.message} />

  if (!isLoading && (!data?.transactions?.length)) {
    return <Empty description={t('empty')} />
  }

  return (
    <div className="payments-container">
      <div className="payments-grid">
        {isLoading ? (
          // Loading skeleton cards
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="payment-card">
              <Skeleton active />
            </Card>
          ))
        ) : (
          data?.transactions?.map((payment) => (
            <Card key={payment.id} className="payment-card">
              <div className="payment-header">
                <span className="payment-type">
                  {t(`type.${payment.type}`)}
                </span>
                <span className={`payment-amount ${payment.type === 'payment' ? 'negative' : 'positive'}`}>
                  {payment.type === 'payment' ? '-' : '+'}{formatMoneyEUR(payment.amount, i18n.language)}
                </span>
              </div>
              <div className="payment-details">
                <div className="payment-date">{formatDateTime(payment.timestamp, i18n.language)}</div>
                {payment.description && (
                  <div className="payment-description">
                    {payment.description}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
      
      {data && (
        <Pagination
          current={page}
          total={data.total}
          pageSize={pageSize}
          onChange={setPage}
          showSizeChanger={false}
          className="payments-pagination"
        />
      )}
    </div>
  )
}
