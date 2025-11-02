import { Card, Alert, Pagination, Empty, Skeleton } from 'antd'
import { WalletOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { usePayments } from './usePayments'
import { useTranslation } from 'react-i18next'
import { formatDateTime, formatMoneyEUR } from '../../core/lib/format'
import styles from './PaymentsTable.module.css'

export function PaymentsTable() {
  const { t, i18n } = useTranslation('payments')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const offset = (page - 1) * pageSize
  const { data, isLoading, isError, error } = usePayments(pageSize, offset)

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        role="alert"
        message={t('loadError')}
        description={(error as Error)?.message}
      />
    )
  }

  if (!isLoading && (!data?.transactions?.length)) {
    return <Empty description={t('empty')} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className={styles.paymentCard}>
                <Skeleton active />
              </Card>
            ))
          : data?.transactions?.map((payment) => {
              const isPayment = payment.type === 'payment'
              const amountClass = [
                styles.paymentAmount,
                isPayment ? styles.paymentAmountNegative : styles.paymentAmountPositive,
              ].join(' ')
              const TypeIcon = isPayment ? UploadOutlined : WalletOutlined
              const typeLabel = isPayment ? t('types.payment') : t('types.topup')
              const cardClass = [
                styles.paymentCard,
                isPayment ? styles.paymentCardPayment : styles.paymentCardTopup,
              ].join(' ')

              return (
                <Card key={payment.id} className={cardClass}>
                  <div className={styles.paymentCardContainer}>
                    <div className={styles.paymentLogo} aria-hidden="true">
                      <TypeIcon aria-hidden />
                    </div>
                    <div className={styles.paymentDetails}>
                      <div className={styles.paymentTypeLabel}>{typeLabel}</div>
                      <div className={styles.paymentDate}>{formatDateTime(payment.timestamp, i18n.language)}</div>
                      {payment.description && (
                        <div className={styles.paymentDescription}>{payment.description}</div>
                      )}
                    </div>
                    <div className={styles.paymentHeader}>
                      <span className={amountClass} aria-label={t('amountAnnounce', {
                        amount: formatMoneyEUR(payment.amount, i18n.language),
                        type: typeLabel,
                        sign: isPayment ? t('amountSigns.negative') : t('amountSigns.positive'),
                      })}>
                        {isPayment ? '-' : '+'}
                        {formatMoneyEUR(payment.amount, i18n.language)}
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
      </div>

      {data && (
        <Pagination
          current={page}
          total={data.total}
          pageSize={pageSize}
          onChange={setPage}
          showSizeChanger={false}
          className={styles.pagination}
          aria-label={t('paginationLabel')}
        />
      )}
    </div>
  )
}
