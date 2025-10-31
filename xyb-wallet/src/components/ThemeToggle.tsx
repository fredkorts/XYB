import { Switch, Tooltip } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useThemeMode } from '../app/providers/useThemeMode'

export function ThemeToggle() {
  const { mode, toggle } = useThemeMode()
  return (
    <Tooltip title={mode === 'dark' ? 'Dark' : 'Light'}>
      <Switch
        checked={mode === 'dark'}
        onChange={toggle}
        checkedChildren={<MoonOutlined aria-label="Dark mode" />}
        unCheckedChildren={<SunOutlined aria-label="Light mode" />}
        aria-label="Toggle color theme"
      />
    </Tooltip>
  )
}
