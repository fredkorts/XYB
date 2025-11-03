import { Alert, Button, Space, Statistic, InputNumber, Card, App } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTopup } from './useTopup'
import { useId, useState } from 'react'
import { formatMoneyEUR } from '../../core/lib/format'
import styles from './TopupForm.module.css'
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'

interface TopupFormProps {
  showForm?: boolean
  onShowFormChange?: (show: boolean) => void
}

export function TopupForm({ showForm: externalShowForm, onShowFormChange }: TopupFormProps = {}) {
  const { t, i18n } = useTranslation('topup')
  const { notification } = App.useApp()
  const { mutateAsync, isPending, isError, error } = useTopup()
  const [internalShowForm, setInternalShowForm] = useState(false)
  const [amount, setAmount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const amountInputId = useId()
  const formSectionId = useId()

  const showForm = externalShowForm !== undefined ? externalShowForm : internalShowForm
  const setShowForm = onShowFormChange || setInternalShowForm

  const quickAmounts = [1, 5, 25, 100]

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(prevAmount => prevAmount + quickAmount)
  }

  const handleClear = () => {
    setAmount(0)
  }

  const handleSubmit = async () => {
    if (amount > 0) {
      try {
        await mutateAsync(amount)

        notification.success({
          message: t('topupSuccess'),
          description: t('topupSuccessDescription', {
            amount: formatMoneyEUR(amount, i18n.language)
          }),
          placement: 'topRight',
          duration: 3,
          showProgress: true,
          pauseOnHover: true,
          style: {
            borderRadius: '12px',
          }
        })

        setAmount(0)
        setShowForm(false)
      } catch (error) {
        console.error('Top-up failed:', error)
      }
    }
  }

  const handleAmountClick = () => {
    setIsEditing(true)
  }

  const handleAmountChange = (value: number | null) => {
    setAmount(value || 0)
  }

  const handleAmountBlur = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setAmount(0)
    setShowForm(false)
    setIsEditing(false)
  }

  if (!showForm) {
    return (
      <Button
        type="primary"
        className={`${styles.toggleButton} ${styles.primaryAction}`}
        onClick={() => setShowForm(true)}
        block
        aria-expanded={false}
        aria-controls={formSectionId}
      >
        {t('topUpLabel')}
      </Button>
    )
  }

  return (
    <>
      <Card id={formSectionId} title={t('amountLabel')}>
        <Space direction="vertical" className={styles.container}>
          {isEditing ? (
            <InputNumber
              id={amountInputId}
              value={amount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              onPressEnter={handleAmountBlur}
              min={0}
              step={0.01}
              className={styles.amountInput}
              aria-label={t('amountLabel')}
              autoFocus
            />
          ) : (
            <button
              type="button"
              className={styles.amountButton}
              onClick={handleAmountClick}
              aria-label={t('editAmount')}
            >
              <div className={styles.amountStatistic} aria-live="polite">
                <Statistic value={formatMoneyEUR(amount, i18n.language)} />
              </div>
            </button>
          )}

          <span className={styles.helperText}>{t('amountHint')}</span>

          <Space wrap className={styles.quickButtons}>
            {quickAmounts.map(quickAmount => (
              <Button
                key={quickAmount}
                className={`${styles.quickButton} ${styles.secondaryAction}`}
                onClick={() => handleQuickAmount(quickAmount)}
                disabled={isPending}
                aria-label={t('quickAmountLabel', {
                  amount: formatMoneyEUR(quickAmount, i18n.language)
                })}
              >
                +{formatMoneyEUR(quickAmount, i18n.language)}
              </Button>
            ))}
          </Space>

          <Space className={styles.actionButtons}>
            <Button
              onClick={handleClear}
              className={styles.dangerAction}
              disabled={isPending}
              icon={<DeleteOutlined />}
              aria-label={t('clearAmount')}
            >
              {t('clear')}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className={styles.primaryAction}
              loading={isPending}
              disabled={amount <= 0}
              icon={<CheckOutlined />}
            >
              {t('submit')}
            </Button>
          </Space>

          {isError && (
            <Alert
              type="error"
              showIcon
              role="alert"
              message={t('topupError')}
              description={(error as Error)?.message}
            />
          )}
        </Space>
      </Card>
      <Button
        className={`${styles.toggleButton} ${styles.dangerAction}`}
        onClick={handleCancel}
        block
        icon={<CloseOutlined />}
        aria-label={t('cancelTopup')}
      >
        {t('cancel')}
      </Button>
    </>
  )
}
