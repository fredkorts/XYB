import { Card, Skeleton, Statistic, Button, Space } from 'antd'
import { useBalance } from './useBalance'
import { useTodaysTopups } from './useTodaysTopups'
import { useTranslation } from 'react-i18next'
import { formatMoneyEUR } from '../../lib/format'
import './BalanceCard.css'

export function BalanceCard() {
  const { t, i18n } = useTranslation('balance')
  const { data, isLoading, isError, refetch } = useBalance()
  const { data: todaysTopups } = useTodaysTopups()

  return (
    <Card title={t('current')}>
      <Skeleton loading={isLoading} active>
        {isError ? (
          <Space direction="vertical">
            <span role="alert">{t('loadError')}</span>
            <Button onClick={() => refetch()}>{t('retry')}</Button>
          </Space>
        ) : (
          <div>
            <Statistic value={formatMoneyEUR(data?.balance ?? 0, i18n.language)} />
            {todaysTopups && todaysTopups.totalAmount > 0 && (
              <div className="balance-card-today-additions">
                +{formatMoneyEUR(todaysTopups.totalAmount, i18n.language)} {t('todayAdditions')}
              </div>
            )}
          </div>
        )}
      </Skeleton>
    </Card>
  )
}
