import { useState } from 'react'
import { mockBotSettings } from '../utils/mockData'

export default function Settings() {
  const [settings, setSettings] = useState(mockBotSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setSavedMessage('Settings saved successfully!')
      setIsSaving(false)
      setTimeout(() => setSavedMessage(''), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-50">Settings</h1>
        <p className="text-dark-400 mt-2">Configure bot parameters, risk management, and notifications</p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="p-4 bg-success-500/10 border border-success-500/20 rounded-lg text-success-500 text-sm font-medium">
          ✓ {savedMessage}
        </div>
      )}

      {/* Model Configuration */}
      <div className="card">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">Model Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-dark-400 mb-3">LLM Model</label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value as any })}
              className="input w-full"
            >
              <option value="claude-3-opus">Claude 3 Opus (Best)</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
              <option value="gpt-4">GPT-4 (Alternative)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo (Fastest)</option>
            </select>
            <p className="text-xs text-dark-400 mt-2">Determines trading decision quality and speed</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-400 mb-3">Min Confidence Threshold</label>
            <input
              type="number"
              value={settings.min_confidence_threshold}
              onChange={(e) => setSettings({ ...settings, min_confidence_threshold: Number(e.target.value) })}
              className="input w-full"
              min="0"
              max="100"
            />
            <p className="text-xs text-dark-400 mt-2">Only execute trades above this confidence level</p>
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="card">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">Risk Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-dark-400 mb-3">Max Position Size ($)</label>
            <input
              type="number"
              value={settings.max_position_size}
              onChange={(e) => setSettings({ ...settings, max_position_size: Number(e.target.value) })}
              className="input w-full"
            />
            <p className="text-xs text-dark-400 mt-2">Maximum capital per position</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-400 mb-3">Max Daily Loss ($)</label>
            <input
              type="number"
              value={settings.max_daily_loss}
              onChange={(e) => setSettings({ ...settings, max_daily_loss: Number(e.target.value) })}
              className="input w-full"
            />
            <p className="text-xs text-dark-400 mt-2">Stop trading after this daily loss</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-400 mb-3">Risk Per Trade (%)</label>
            <input
              type="number"
              value={settings.risk_per_trade}
              onChange={(e) => setSettings({ ...settings, risk_per_trade: Number(e.target.value) })}
              className="input w-full"
              min="0.1"
              max="5"
              step="0.1"
            />
            <p className="text-xs text-dark-400 mt-2">Percentage of capital risked per trade</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-400 mb-3">Trailing Stop (%)</label>
            <input
              type="number"
              value={settings.trailing_stop_percent}
              onChange={(e) => setSettings({ ...settings, trailing_stop_percent: Number(e.target.value) })}
              className="input w-full"
              min="0.1"
              max="10"
              step="0.1"
            />
            <p className="text-xs text-dark-400 mt-2">Automatic stop loss from position high</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">Notifications & Alerts</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-dark-700/50 transition-colors">
            <input
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) => setSettings({ ...settings, notifications_enabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <div>
              <p className="font-medium text-dark-50">Enable All Notifications</p>
              <p className="text-xs text-dark-400">Master toggle for all notification types</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-dark-700/50 transition-colors">
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <div>
              <p className="font-medium text-dark-50">Email Notifications</p>
              <p className="text-xs text-dark-400">Receive alerts via email for major events</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-dark-700/50 transition-colors">
            <input
              type="checkbox"
              checked={settings.push_notifications}
              onChange={(e) => setSettings({ ...settings, push_notifications: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <div>
              <p className="font-medium text-dark-50">Push Notifications</p>
              <p className="text-xs text-dark-400">Real-time alerts on your mobile device</p>
            </div>
          </label>
        </div>
      </div>

      {/* Webhooks */}
      <div className="card">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">Webhooks & Integrations</h2>
        <div>
          <label className="block text-sm font-bold text-dark-400 mb-3">Webhook URL</label>
          <input
            type="text"
            value={settings.webhook_url || ''}
            onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
            placeholder="https://example.com/webhook"
            className="input w-full"
          />
          <p className="text-xs text-dark-400 mt-2">Receive JSON payloads for all trade events</p>

          <div className="mt-6 p-4 bg-dark-700/50 rounded-lg border border-dark-700">
            <h3 className="font-bold text-dark-50 mb-3">Webhook Example Payload</h3>
            <pre className="text-xs bg-dark-900 p-3 rounded overflow-x-auto text-dark-300">
{`{
  "event": "trade_executed",
  "symbol": "AAPL",
  "side": "LONG",
  "price": 175.50,
  "quantity": 50,
  "confidence": 87,
  "timestamp": "2024-03-23T18:30:00Z"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="card">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">Advanced Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <h3 className="font-bold text-dark-50 mb-2">Backtest Settings</h3>
            <button className="btn btn-secondary text-sm">
              Run Backtest
            </button>
            <p className="text-xs text-dark-400 mt-2">Test strategies against historical data</p>
          </div>

          <div className="p-4 bg-dark-700/50 rounded-lg">
            <h3 className="font-bold text-dark-50 mb-2">Paper Trading</h3>
            <button className="btn btn-secondary text-sm">
              Enable Paper Trading
            </button>
            <p className="text-xs text-dark-400 mt-2">Test with simulated funds</p>
          </div>

          <div className="p-4 bg-dark-700/50 rounded-lg">
            <h3 className="font-bold text-dark-50 mb-2">API Keys</h3>
            <button className="btn btn-secondary text-sm">
              Manage API Keys
            </button>
            <p className="text-xs text-dark-400 mt-2">Configure broker and data provider connections</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <h2 className="text-2xl font-bold text-dark-50 mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-dark-700/50 rounded-lg">
            <p className="text-dark-400 text-sm mb-2">Bot Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <p className="font-bold text-success-500">Running</p>
            </div>
          </div>
          <div className="p-3 bg-dark-700/50 rounded-lg">
            <p className="text-dark-400 text-sm mb-2">API Connection</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <p className="font-bold text-success-500">Connected</p>
            </div>
          </div>
          <div className="p-3 bg-dark-700/50 rounded-lg">
            <p className="text-dark-400 text-sm mb-2">Last Updated</p>
            <p className="font-bold text-dark-50">2 seconds ago</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button className="btn btn-secondary">
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
