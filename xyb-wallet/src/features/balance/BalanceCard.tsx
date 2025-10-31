import { Card, Skeleton, Statistic, Button, Space } from 'antd'
import { useBalance } from './useBalance'
import { useTranslation } from 'react-i18next'
import { formatMoneyEUR } from '../../lib/format'

export function BalanceCard() {
  const { t, i18n } = useTranslation('balance')
  const { data, isLoading, isError, refetch, isFetching } = useBalance()

  return (
    <Card title={t('title')} extra={<Button onClick={() => refetch()} loading={isFetching}>{t('refresh')}</Button>}>
      <Skeleton loading={isLoading} active>
        {isError ? (
          <Space direction="vertical">
            <span role="alert">{t('loadError')}</span>
            <Button onClick={() => refetch()}>{t('retry')}</Button>
          </Space>
        ) : (
          <Statistic title={t('current')} value={formatMoneyEUR(data?.balance ?? 0, i18n.language)} />
        )}
      </Skeleton>
    </Card>
  )
}
