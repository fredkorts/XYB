import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en_common from './locales/en/common.json'
import et_common from './locales/et/common.json'
import en_balance from './locales/en/balance.json'
import et_balance from './locales/et/balance.json'
import en_payments from './locales/en/payments.json'
import et_payments from './locales/et/payments.json'
import en_topup from './locales/en/topup.json'
import et_topup from './locales/et/topup.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        common: en_common,
        balance: en_balance,
        payments: en_payments,
        topup: en_topup
      },
      et: { 
        common: et_common,
        balance: et_balance,
        payments: et_payments,
        topup: et_topup
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  })

export default i18n
