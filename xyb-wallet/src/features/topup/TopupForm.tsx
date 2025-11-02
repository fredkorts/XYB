import { Alert, Button, Space, Statistic, InputNumber, Card, App } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTopup } from './useTopup'
import { useState } from 'react'
import { formatMoneyEUR } from '../../lib/format'
import './TopupForm.css'

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

  // Use external state if provided, otherwise use internal state
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
        
        // Show success notification
        notification.success({
          message: t('topupSuccess'),
          description: t('topupSuccessDescription', { 
            amount: formatMoneyEUR(amount, i18n.language) 
          }),
          placement: 'topRight',
          duration: 2.5,
        })
        
        setAmount(0)
        setShowForm(false)
      } catch (error) {
        console.error('Top-up failed:', error)
        // Error handling is managed by the mutation
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
      <Button type="primary" className="topup-form-toggle-button primary" onClick={() => setShowForm(true)} block>
        {t('submit')}
      </Button>
    )
  }

  return (
    <>
      <Card title={t('amountLabel')}>
        <Space direction="vertical" className="topup-form-container">
          <div onClick={handleAmountClick} className="topup-form-amount-clickable">
            {isEditing ? (
              <InputNumber
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                onPressEnter={handleAmountBlur}
                min={0}
                step={0.01}
                className="topup-form-amount-input"
                autoFocus
              />
            ) : (
              <Statistic value={formatMoneyEUR(amount, i18n.language)} />
            )}
          </div>
          
          <Space wrap className="topup-form-quick-buttons">
            {quickAmounts.map(quickAmount => (
              <Button 
                key={quickAmount}
                className="topup-form-quick-button secondary"
                onClick={() => handleQuickAmount(quickAmount)}
                disabled={isPending}
              >
                +{formatMoneyEUR(quickAmount, i18n.language)}
              </Button>
            ))}
            <Button onClick={handleClear} className="cancel" disabled={isPending} danger>
              {t('clear')}
            </Button>
          </Space>

          <Space className="topup-form-action-buttons">
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              className="primary"
              loading={isPending}
              disabled={amount <= 0}
              block
            >
              {t('submit')} {amount > 0 && formatMoneyEUR(amount, i18n.language)}
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
      <Button className="topup-form-toggle-button cancel" onClick={handleCancel} block>
        {t('cancel')}
      </Button>
    </>
  )
}
