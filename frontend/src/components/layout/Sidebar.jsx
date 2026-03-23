import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  TrendingUp, 
  PieChart, 
  Zap, 
  History, 
  Settings,
  BookOpen
} from 'lucide-react';
import '../../styles/layout.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/bot-activity', icon: Activity, label: 'Bot Activity' },
    { path: '/prediction-markets', icon: TrendingUp, label: 'Markets' },
    { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
    { path: '/signals', icon: Zap, label: 'Signals' },
    { path: '/trade-history', icon: History, label: 'Trade History' },
    { path: '/learning', icon: BookOpen, label: 'Learning' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <Icon size={20} />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
