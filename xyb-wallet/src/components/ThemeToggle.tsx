import { Switch, Tooltip } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useThemeMode } from '../core/providers/useThemeMode'
import { useTranslation } from 'react-i18next'

export function ThemeToggle() {
  const { mode, toggle } = useThemeMode()
  const { t } = useTranslation('common')

  return (
    <Tooltip title={mode === 'dark' ? t('theme.dark') : t('theme.light')}>
      <Switch
        checked={mode === 'dark'}
        onChange={toggle}
        checkedChildren={<MoonOutlined aria-label={t('theme.darkMode')} />}
        unCheckedChildren={<SunOutlined aria-label={t('theme.lightMode')} />}
        aria-label={t('theme.toggle')}
      />
    </Tooltip>
  )
}
