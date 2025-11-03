import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
type Lang = 'en' | 'et'

export function LanguageSelect() {
  const { i18n, t } = useTranslation('common')
  const value: Lang = (i18n.language?.startsWith('et') ? 'et' : 'en') as Lang
  return (
    <Select
      value={value}
      aria-label={t('language')}
      onChange={(lng: Lang) => i18n.changeLanguage(lng)}
      options={[{ value: 'en', label: 'English' }, { value: 'et', label: 'Eesti' }]}
      style={{ width: 120 }}
    />
  )
}
