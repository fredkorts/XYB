import { Layout, Space, Typography, Divider } from 'antd'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageSelect } from './components/LanguageSelect'
import { BalanceCard } from './features/balance/BalanceCard'
import { TopupForm } from './features/topup/TopupForm'
import { PaymentsTable } from './features/payments/PaymentsTable'
import { useTranslation } from 'react-i18next'

export default function App() {
  const { t } = useTranslation('common')
  return (
    <Layout className="app">
      <header className="header">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>{t('appTitle')}</Typography.Title>
          <Space><LanguageSelect /><ThemeToggle /></Space>
        </Space>
      </header>

      <main className="main">
        <section>
          <BalanceCard />
          <Divider style={{ margin: 0 }} />
          <TopupForm />
        </section>
        <section>
          <PaymentsTable />
        </section>
      </main>

      <footer className="footer">
        <Typography.Text type="secondary">{t('footer')}</Typography.Text>
      </footer>
    </Layout>
  )
}
