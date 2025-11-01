import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

void i18n.use(initReactI18next).init({
  lng: 'en',
  resources: { en: { common: { appTitle: 'XYB Wallet', footer: 'Demo' } } },
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
