import { Alert, Button, Form, InputNumber, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTopup } from './useTopup'

export function TopupForm() {
  const { t } = useTranslation('topup')
  const [form] = Form.useForm()
  const { mutateAsync, isPending, isError, error } = useTopup()

  async function onFinish(values: { amount: number }) {
    await mutateAsync(values.amount)
    form.resetFields(['amount'])
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="amount"
          label={t('amountLabel')}
          rules={[
            { required: true, message: t('errors:required') },
            { type: 'number', min: 0.01, message: t('minAmount') },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0.01} step={0.5} placeholder={t('amountPlaceholder')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>{t('submit')}</Button>
        </Form.Item>
      </Form>
      {isError && <Alert type="error" showIcon role="alert" message={t('topupError')} description={(error as Error)?.message} />}
    </Space>
  )
}
