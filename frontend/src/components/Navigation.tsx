import { Link, useLocation } from 'react-router-dom'
import { Dispatch, SetStateAction } from 'react'

interface NavigationProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'grid' },
  { name: 'Portfolio', path: '/portfolio', icon: 'briefcase' },
  { name: 'Bot Activity', path: '/activity', icon: 'activity' },
  { name: 'Signals', path: '/signals', icon: 'signal' },
  { name: 'Trade History', path: '/history', icon: 'history' },
  { name: 'Prediction Markets', path: '/markets', icon: 'trending' },
  { name: 'Learning Hub', path: '/learning', icon: 'book' },
  { name: 'Settings', path: '/settings', icon: 'settings' },
]

export default function Navigation({ sidebarOpen, setSidebarOpen }: NavigationProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: string } = {
      grid: 'M3 12a9 9 0 1118 0 9 9 0 01-18 0z',
      briefcase: 'M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10l8-4V7m-8 4L4 11v10l8 4m0-10l8-4',
      activity: 'M13 10V3L4 14h7v7l9-11h-7z',
      signal: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      history: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      trending: 'M13 7H7v6h6V7zM13 13H7v6h6v-6zM19 7v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2z',
      book: 'M12 6.253v13m0-13C6.228 6.253 2.538 7.06 2.538 8.296c0 1.236 3.69 2.046 9.462 2.046 5.771 0 9.462-.81 9.462-2.046 0-1.236-3.69-2.043-9.462-2.043zM12 19.253v-13m0 0C6.228 6.253 2.538 7.06 2.538 8.296m9.462-2.043c5.771 0 9.462.81 9.462 2.046 0 1.236-3.691 2.043-9.462 2.043m0 0A9.465 9.465 0 005.909 15m6.091 0a9.465 9.465 0 016.091-4.751m0 0c3.69.78 6.544 1.645 6.544 2.71 0 1.236-3.69 2.046-9.462 2.046-5.771 0-9.462-.81-9.462-2.046 0-1.065 2.853-1.93 6.544-2.71',
      settings: 'M12 6V4m0 2a2 2 0 100 4 2 2 0 000-4zm0 0a2 2 0 100 4 2 2 0 000-4zm8 0V4m0 2a2 2 0 100 4 2 2 0 000-4zm0 0a2 2 0 100 4 2 2 0 000-4zm-8 8v-2a2 2 0 100-4 2 2 0 000 4zm0 0a2 2 0 100 4 2 2 0 000-4zm8 0v-2a2 2 0 100-4 2 2 0 000 4zm0 0a2 2 0 100 4 2 2 0 000-4z',
    }
    return icons[iconName] || icons.grid
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`
        hidden lg:flex lg:flex-col w-64 bg-dark-800 border-r border-dark-700
        overflow-y-auto transition-all duration-300
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center font-bold text-white">
              ⚡
            </div>
            <div>
              <h1 className="font-bold text-lg">TradeBot</h1>
              <p className="text-xs text-dark-400">AI Trading Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive(item.path)
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                    : 'text-dark-300 hover:bg-dark-700/50 hover:text-dark-50'
                }
              `}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(item.icon)} />
              </svg>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <div className="bg-dark-700/50 rounded-lg p-3 text-center">
            <p className="text-xs text-dark-400">Last updated</p>
            <p className="text-xs font-mono text-dark-300">2 seconds ago</p>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <nav className="fixed inset-0 z-50 lg:hidden bg-dark-800">
          <div className="p-6 border-b border-dark-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center font-bold text-white">
                ⚡
              </div>
              <div>
                <h1 className="font-bold text-lg">TradeBot</h1>
                <p className="text-xs text-dark-400">AI Trading</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-dark-700 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                      : 'text-dark-300 hover:bg-dark-700/50 hover:text-dark-50'
                  }
                `}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(item.icon)} />
                </svg>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  )
}
