import { Layout, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { LanguageSelect } from '../../components/LanguageSelect'
import { ThemeToggle } from '../../components/ThemeToggle'
import { BalanceCard } from '../../features/balance/BalanceCard'
import { TopupForm } from '../../features/topup/TopupForm'
import { PaymentsTable } from '../../features/payments/PaymentsTable'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const { t } = useTranslation('common')
  const [showTopupForm, setShowTopupForm] = useState(false)

  return (
    <Layout className={styles.page}>
      <a href="#main-content" className={styles.skipLink}>
        {t('skipToContent', 'Skip to main content')}
      </a>

      <header className={styles.header}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {t('appTitle')}
          </Typography.Title>
          <Space>
            <LanguageSelect />
            <ThemeToggle />
          </Space>
        </Space>
      </header>

      <main id="main-content" className={styles.main}>
        <section className={styles.section} aria-label={t('accountOverview', 'Account overview')}>
          {!showTopupForm ? (
            <>
              <BalanceCard />
              <TopupForm showForm={showTopupForm} onShowFormChange={setShowTopupForm} />
            </>
          ) : (
            <TopupForm showForm={showTopupForm} onShowFormChange={setShowTopupForm} />
          )}
        </section>

        <section className={styles.section} aria-label={t('recentActivity', 'Recent activity')}>
          <PaymentsTable />
        </section>
      </main>

      <footer className={styles.footer}>
        <Typography.Text type="secondary">{t('footer')}</Typography.Text>
      </footer>
    </Layout>
  )
}

export default DashboardPage
