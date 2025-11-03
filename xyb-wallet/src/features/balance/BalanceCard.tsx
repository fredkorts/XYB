import { Card, Skeleton, Statistic, Button, Space } from 'antd'
import { useBalance } from './useBalance'
import { useTodaysTopups } from './useTodaysTopups'
import { useTranslation } from 'react-i18next'
import { formatMoneyEUR } from '../../core/lib/format'
import styles from './BalanceCard.module.css'

export function BalanceCard() {
  const { t, i18n } = useTranslation('balance')
  const { data, isLoading, isError, refetch } = useBalance()
  const { data: todaysTopups } = useTodaysTopups()

  const formattedBalance = formatMoneyEUR(data?.balance ?? 0, i18n.language)
  const todaysTopupAmount = formatMoneyEUR(todaysTopups?.totalAmount ?? 0, i18n.language)
  const balanceAnnouncement = `${t('current')}: ${formattedBalance}`
  const todaysTopupAnnouncement = `${t('todayAdditions')}: ${todaysTopupAmount}`

  return (
    <Card title={t('current')} aria-live="polite" aria-busy={isLoading}>
      <Skeleton loading={isLoading} active>
        {isError ? (
          <Space direction="vertical">
            <span role="alert">{t('loadError')}</span>
            <Button onClick={() => refetch()}>{t('retry')}</Button>
          </Space>
        ) : (
          <div aria-live="polite" aria-atomic="true">
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={styles.balanceStatistic}
            >
              <Statistic value={formattedBalance} aria-hidden />
              <span className={styles.visuallyHidden}>{balanceAnnouncement}</span>
            </div>
            {todaysTopups && todaysTopups.totalAmount > 0 && (
              <div
                className={styles.todaysAdditions}
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <span aria-hidden="true">
                  +{todaysTopupAmount} {t('todayAdditions')}
                </span>
                <span className={styles.visuallyHidden}>{todaysTopupAnnouncement}</span>
              </div>
            )}
          </div>
        )}
      </Skeleton>
    </Card>
  )
}
